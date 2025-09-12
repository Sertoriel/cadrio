// src/components/FormularioEtapas.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CampoInput from './CampoInput';
import CampoSelect from './CampoSelect';
import AlertBox from './AlertBox';
import api from '../api/axios';

// Tipos de Dados
type FormDataType = {
  cpf: string;
  nome: string;
  celular: string;
  telefone: string;
  tipo: string;
  bairro: string;
  unidade: string;
  data: string;
  horario: string;
};

type AgendamentoResponse = { message?: string; nome?: string; [k: string]: any };
type CrasType = { codigo: string; nome: string; bairro: string };
type CrasResponse = { cras: CrasType[] };
type Vaga = { id: number; data: string; hora: string };
type CrasVagas = {
  datas: string[];
  vagas: { [date: string]: Vaga[] };
};
type DisponibilidadeResponse = { cras_vagas: CrasVagas };
type MutationPayload = { formData: FormDataType; recaptchaToken: string };

const FormularioEtapas: React.FC = () => {
  // Estados do Componente
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [formData, setFormData] = useState<FormDataType>({
    cpf: '', nome: '', celular: '', telefone: '',
    tipo: '', bairro: '', unidade: '', data: '', horario: ''
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [submitResult, setSubmitResult] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertVariant, setAlertVariant] = useState<'info' | 'success' | 'error'>('info');
  const [unidadesCras, setUnidadesCras] = useState<CrasType[]>([]);
  const [disponibilidade, setDisponibilidade] = useState<CrasVagas>({ datas: [], vagas: {} });
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');

  const queryClient = useQueryClient();

  // Dados Estáticos (Fallbacks)
  const fallbackBairros: string[] = [
    'Abolição', 'Acari', 'Água Santa', 'Alto da Boa Vista', 'Anchieta', 'Andaraí', 'Anil',
    'Bairro Imperial de São Cristóvão', 'Bancários', 'Bangu', 'Barra da Tijuca', 'Barra de Guaratiba',
    'Barros Filho', 'Benfica', 'Bento Ribeiro', 'Bonsucesso', 'Botafogo', 'Brás de Pina',
    'Cachambi', 'Cacuia', 'Caju', 'Camorim', 'Campinho', 'Campo dos Afonsos', 'Campo Grande',
    'Cascadura', 'Catete', 'Catumbi', 'Cavalcanti', 'Centro', 'Cidade de Deus', 'Cidade Nova',
    'Copacabana', 'Flamengo', 'Ipanema', 'Leblon', 'Tijuca', 'Vila Isabel', 'Madureira',
    'Méier', 'Penha', 'Realengo', 'Santa Cruz', 'São Conrado', 'Recreio dos Bandeirantes'
  ];

  const fallbackTipos = [
    { value: 'Criação', label: 'Novo Cadastro' },
    { value: 'Atualização', label: 'Atualização Cadastral' }
  ];

  // --- React Query (Hooks de API) ---

  const agendamentoQuery = useQuery<AgendamentoResponse>({
    queryKey: ['agendamento', formData.cpf],
    queryFn: async () => {
      const { data } = await api.get(`/agendamento/${formData.cpf}`);
      return data;
    },
    enabled: false, // Execução manual através de refetch()
    retry: false
  });

  const { data: crasData, isLoading: isCrasLoading, isError: isCrasError } = useQuery<CrasResponse>({
    queryKey: ['cras', formData.bairro],
    queryFn: async () => {
      const response = await api.get<CrasResponse>(`/cras/`);
      return response.data;
    },
    enabled: !!formData.bairro,
    retry: 1,
  });

  useEffect(() => {
    if (crasData) {
      setUnidadesCras(crasData?.cras || []);
    }
    if (isCrasError) {
      setUnidadesCras([]);
    }
  }, [crasData, isCrasError]);

  const { data: disponibilidadeData, isLoading: isDisponibilidadeLoading, isError: isDisponibilidadeError } = useQuery<DisponibilidadeResponse>({
    queryKey: ['disponibilidade', formData.unidade],
    queryFn: async () => {
      const response = await api.get<DisponibilidadeResponse>(`/disponibilidades/${formData.unidade}`);
      return response.data;
    },
    enabled: !!formData.unidade,
    retry: 1,
  });

  useEffect(() => {
    if (disponibilidadeData) {
      setDisponibilidade(disponibilidadeData.cras_vagas);
    } else {
      setDisponibilidade({ datas: [], vagas: {} });
    }
  }, [disponibilidadeData]);

  const createAgendamento = async (payload: MutationPayload): Promise<AgendamentoResponse> => {
    const { formData, recaptchaToken } = payload;
    const dataToSend = new FormData();
    const unidadeSelecionada = unidadesCras.find(c => c.codigo === formData.unidade);
    const textoCras = unidadeSelecionada
      ? `${unidadeSelecionada.nome} Endereço: ${unidadeSelecionada.bairro}.`
      : 'Unidade não encontrada';

    dataToSend.append('cpf', formData.cpf.replace(/\D/g, ''));
    dataToSend.append('nome', formData.nome);
    dataToSend.append('celular', formData.celular.replace(/\D/g, ''));
    dataToSend.append('telefone', formData.telefone.replace(/\D/g, ''));
    dataToSend.append('bairro', formData.bairro);
    dataToSend.append('tipo', formData.tipo);
    dataToSend.append('selcras', formData.unidade);
    dataToSend.append('selhora', formData.horario);
    dataToSend.append('recaptcha', recaptchaToken);
    dataToSend.append('cras', textoCras);

    const { data } = await api.post('/agendamento', dataToSend);
    return data;
  };

  const mutation = useMutation<AgendamentoResponse, unknown, MutationPayload>({
    mutationFn: createAgendamento,
    onSuccess: (data) => {
      setSubmitResult(null);
      setAlertVariant('success');
      setAlertMessage(data?.message ?? 'Agendamento confirmado com sucesso!');
      setAlertVisible(true);
      queryClient.invalidateQueries({ queryKey: ['agendamento'] });

      setTimeout(() => {
        window.location.reload();
      }, 5000);
    },
    onError: (err: any) => {
      if (err?.response?.status === 422 && err.response.data?.errors) {
        // Lógica de erro para campos específicos (se necessário)
      } else {
        const apiMsg = err.response?.data?.message || 'Erro ao enviar. Tente novamente mais tarde.';
        setAlertVariant('error');
        setAlertMessage(apiMsg);
        setAlertVisible(true);
      }
    }
  });

  const mutationIsLoading = mutation.isPending;

  // --- Funções Auxiliares (Helpers) ---

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numbers.length === 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const validateCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length !== 11 || /^(\d)\1{10}$/.test(numbers)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(numbers.charAt(i)) * (10 - i);
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(numbers.charAt(i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.charAt(10))) return false;
    
    return true;
  };

  const validatePhone = (phone: string, isRequired: boolean = true) => {
    if (!isRequired && !phone.trim()) return true;
    const numbers = phone.replace(/\D/g, '');
    if (!numbers.startsWith('21')) return false;
    return numbers.length === 11 || numbers.length === 10;
  };

  const isFieldValid = (field: keyof FormDataType, value: string) => {
    switch (field) {
      case 'cpf': return validateCPF(value);
      case 'nome': return value.trim().length >= 3 && /^[a-zA-ZÀ-ÿ\s]+$/.test(value.trim());
      case 'celular': return validatePhone(value, true);
      case 'telefone': return validatePhone(value, false);
      case 'tipo':
      case 'bairro':
      case 'unidade':
      case 'data':
      case 'horario': return value !== '';
      default: return true;
    }
  };

  const getNextStage = (field: string) => {
    const stageMap: { [key: string]: number } = {
      'cpf': 1, 'nome': 2, 'celular': 3, 'telefone': 4, 'tipo': 5,
      'bairro': 6, 'unidade': 7, 'data': 8, 'horario': 9
    };
    return stageMap[field] ?? currentStage;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const canShowStage = (stage: number) => currentStage >= stage;

  // --- Handlers de Interação ---

  const handleCpfChange = (value: string) => {
    const formattedValue = formatCPF(value);
    setFormData(prev => ({ ...prev, cpf: formattedValue }));
    if (errors.cpf) {
      setErrors(prev => ({ ...prev, cpf: '' }));
    }
  };

  const handleInputChange = (field: keyof FormDataType, value: string) => {
    if (field === 'unidade') {
      setFormData(prev => ({ ...prev, unidade: value, data: '', horario: '' }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    setErrors(prev => ({ ...prev, [field]: '' }));

    if (isFieldValid(field, value)) {
      if (currentStage > 0) {
        const nextStage = getNextStage(field);
        if (nextStage > currentStage) {
          setTimeout(() => setCurrentStage(nextStage), 300);
        }
      }
    } else if (value) {
      setErrors(prev => ({ ...prev, [field]: `O campo ${field} está inválido.` }));
    }
  };

  const handleCPFBlur = async () => {
    setAlertVisible(false);

    if (!validateCPF(formData.cpf)) {
      if (formData.cpf.length > 0) {
        setErrors(prev => ({ ...prev, cpf: 'CPF inválido.' }));
      }
      return;
    }

    try {
      const result = await agendamentoQuery.refetch();
      if (result.data?.message) {
        setAlertMessage(result.data.message);
        setAlertVariant('info');
        setAlertVisible(true);
        if (result.data?.nome) {
          setFormData(prev => ({ ...prev, nome: String(result.data.nome) }));
        }
      }
    } catch (err: any) {
      if (err.response?.status !== 404) {
        const apiMsg = err.response?.data?.message || 'Erro ao consultar CPF. Tente novamente.';
        setAlertMessage(apiMsg);
        setAlertVariant('error');
        setAlertVisible(true);
      }
    }
    
    // Avança para a próxima etapa se o CPF for matematicamente válido
    setCurrentStage(5);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitResult(null);
    setAlertVisible(false);

    const invalidFields: { [k: string]: string } = {};
    (Object.keys(formData) as Array<keyof FormDataType>).forEach((key) => {
      if (!isFieldValid(key, formData[key])) {
        invalidFields[key] = `Campo ${key} inválido ou obrigatório.`;
      }
    });

    if (!recaptchaToken) {
      invalidFields['recaptcha'] = 'Por favor, complete o reCAPTCHA.';
    }

    if (Object.keys(invalidFields).length > 0) {
      setErrors(prev => ({ ...prev, ...invalidFields }));
      const firstInvalid = Object.keys(invalidFields)[0];
      if (firstInvalid !== 'recaptcha') {
        setCurrentStage(getNextStage(firstInvalid));
      }
      return;
    }

    mutation.mutate({ formData, recaptchaToken });
  };
  
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-3">Agendamento Cadastro Único</h2>
        <h3 className="text-xl text-gray-600 font-medium">O Atendimento é destinado para o município do Rio de Janeiro</h3>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8"></div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <AlertBox
          visible={alertVisible}
          message={alertMessage}
          variant={alertVariant}
          onClose={() => setAlertVisible(false)}
        />

        {/* Etapa 1: Dados Pessoais */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
            Dados Pessoais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CampoInput
              label="CPF"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={handleCpfChange}
              onBlur={handleCPFBlur}
              error={errors.cpf}
              required
              maxLength={14}
              visible={canShowStage(0)}
              inputMode="numeric"
            />
            {canShowStage(1) && (
              <CampoInput
                label="Nome Completo"
                placeholder="Informe seu nome completo"
                value={formData.nome}
                onChange={(value) => handleInputChange('nome', value)}
                error={errors.nome}
                required
                visible
              />
            )}
            {canShowStage(2) && (
              <CampoInput
                label="Celular"
                placeholder="(21) 99999-9999"
                value={formData.celular}
                onChange={(value) => handleInputChange('celular', formatPhone(value))}
                error={errors.celular}
                required
                maxLength={15}
                visible
                inputMode="numeric"
              />
            )}
            {canShowStage(3) && (
              <CampoInput
                label="Telefone Fixo (Opcional)"
                placeholder="(21) 3333-3333"
                value={formData.telefone}
                onChange={(value) => handleInputChange('telefone', formatPhone(value))}
                maxLength={15}
                visible
                inputMode="numeric"
              />
            )}
            {canShowStage(4) && (
              <CampoSelect
                label="Tipo de Atendimento"
                value={formData.tipo}
                onChange={(value) => handleInputChange('tipo', value)}
                options={fallbackTipos}
                error={errors.tipo}
                required
                visible
              />
            )}
            {canShowStage(5) && (
              <CampoSelect
                label="Bairro de Moradia"
                value={formData.bairro}
                onChange={(value) => handleInputChange('bairro', value)}
                options={fallbackBairros.map((b) => ({ value: b, label: b }))}
                error={errors.bairro}
                required
                visible
              />
            )}
          </div>
        </div>

        {/* Etapa 2: Agendamento */}
        {canShowStage(6) && (
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
             <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-2 h-6 bg-green-600 rounded-full"></div>
                Agendamento
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                 <h4 className="text-lg font-semibold text-gray-800">Escolha uma Unidade</h4>
                <CampoSelect
                  label=""
                  value={formData.unidade}
                  onChange={(value) => handleInputChange('unidade', value)}
                  options={unidadesCras.map((cras) => ({
                    value: cras.codigo,
                    label: cras.nome,
                  }))}
                  required
                  visible
                  disabled={isCrasLoading}
                />
                {isCrasLoading && <p className="text-sm text-gray-500">Carregando unidades...</p>}
                {isCrasError && <p className="text-sm text-red-500">Erro ao buscar unidades. Tente outro bairro.</p>}
                {!isCrasLoading && !isCrasError && formData.bairro && unidadesCras.length === 0 && (
                  <p className="text-sm text-yellow-600">Nenhuma unidade encontrada para este bairro.</p>
                )}
                {formData.unidade && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Endereço:</p>
                        <p className="text-sm text-blue-700">
                          {unidadesCras.find(c => c.codigo === formData.unidade)?.bairro || 'Endereço não disponível'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {canShowStage(7) && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <h4 className="text-lg font-semibold text-gray-800">Escolha a Data</h4>
                  </div>
                  {isDisponibilidadeLoading && <p className="text-sm text-gray-500">Carregando datas disponíveis...</p>}
                  {isDisponibilidadeError && <p className="text-sm text-red-500">Erro ao buscar datas.</p>}
                  <div className="grid grid-cols-3 gap-2">
                    {disponibilidade.datas.map((data) => (
                      <button
                        key={data}
                        type="button"
                        onClick={() => handleInputChange('data', data)}
                        className={`p-3 text-sm rounded-lg border transition-all duration-200 ${
                          formData.data === data
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        {new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                      </button>
                    ))}
                  </div>
                  {formData.data && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800 font-medium">Data selecionada: {formatDate(formData.data)}</p>
                    </div>
                  )}
                </div>
              )}
              {canShowStage(8) && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <h4 className="text-lg font-semibold text-gray-800">Escolha o Horário</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(disponibilidade.vagas[formData.data] || []).map((vaga) => (
                      <button
                        key={vaga.id}
                        type="button"
                        onClick={() => handleInputChange('horario', String(vaga.id))}
                        className={`p-3 text-sm rounded-lg border transition-all duration-200 ${
                          formData.horario === String(vaga.id)
                            ? 'bg-green-600 text-white border-green-600 shadow-md'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50'
                        }`}
                      >
                        {vaga.hora}
                      </button>
                    ))}
                  </div>
                  {formData.data && (disponibilidade.vagas[formData.data] || []).length === 0 && !isDisponibilidadeLoading && (
                    <p className="text-sm text-yellow-600">Nenhum horário disponível para esta data.</p>
                  )}
                  {formData.horario && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800 font-medium">
                        Horário selecionado: {disponibilidade.vagas[formData.data]?.find(v => String(v.id) === formData.horario)?.hora}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Etapa 3: Confirmação */}
        {canShowStage(9) && (
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-2 h-6 bg-purple-600 rounded-full"></div>
              Confirmação do Agendamento
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h4 className="font-semibold text-gray-800 mb-4">Resumo do Agendamento:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Nome:</strong> {formData.nome}</div>
                <div><strong>CPF:</strong> {formData.cpf}</div>
                <div><strong>Tipo:</strong> {formData.tipo}</div>
                <div><strong>Bairro:</strong> {formData.bairro}</div>
                <div><strong>Data:</strong> {formatDate(formData.data)}</div>
                <div><strong>Horário:</strong> {disponibilidade.vagas[formData.data]?.find(v => String(v.id) === formData.horario)?.hora}</div>
              </div>
            </div>
            <div className="mb-6">
              {/* Lembre-se de implementar um componente reCAPTCHA aqui */}
              <div className="bg-gray-100 p-4 rounded-lg inline-block">
                <p className="text-sm text-gray-600">reCAPTCHA será exibido aqui</p>
                {/* Input temporário para teste, remova depois */}
                <input
                  type="text"
                  value={recaptchaToken}
                  onChange={(e) => setRecaptchaToken(e.target.value)}
                  placeholder="Simular token reCAPTCHA"
                  className="mt-2 p-1 border"
                />
              </div>
              {errors.recaptcha && <p className="text-red-500 text-sm mt-1">{errors.recaptcha}</p>}
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-8 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-lg"
                disabled={mutationIsLoading}
              >
                {mutationIsLoading ? 'Enviando...' : 'Confirmar Agendamento'}
              </button>
              {submitResult && <p className="mt-3 text-sm text-green-700">{submitResult}</p>}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default FormularioEtapas;