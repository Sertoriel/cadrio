// //Warning: This is a save file for FormularioEtapas.tsx the codes here may be incomplete or incorrect or deprecated

// // src/components/FormularioEtapas.tsx
// import React, { useState, useEffect } from 'react';
// import CampoInput from './CampoInput';
// import CampoSelect from './CampoSelect';
// import AlertBox from './AlertBox';
// import { Calendar, Clock, MapPin } from 'lucide-react';
// import { useQuery, useMutation, useQueryClient, QueryObserverResult } from '@tanstack/react-query';
// import api from '../api/axios';

// type FormDataType = {
//     cpf: string;
//     nome: string;
//     celular: string;
//     telefone: string;
//     tipo: string;
//     bairro: string;
//     unidade: string;
//     data: string;
//     horario: string;
// };

// type Unidade = { value: string; label: string; endereco: string };
// type AgendamentoResponse = { message?: string; nome?: string;[k: string]: any };

// const FormularioEtapas: React.FC = () => {
//     const [currentStage, setCurrentStage] = useState<number>(0);
//     const [formData, setFormData] = useState<FormDataType>({
//         cpf: '',
//         nome: '',
//         celular: '',
//         telefone: '',
//         tipo: '',
//         bairro: '',
//         unidade: '',
//         data: '',
//         horario: ''
//     });
//     const [errors, setErrors] = useState<{ [k: string]: string }>({});
//     const [cpfAPIResult, setCpfAPIResult] = useState<string>('');
//     const [submitResult, setSubmitResult] = useState<string | null>(null);
//     const [alertVisible, setAlertVisible] = useState<boolean | undefined>(false);
//     const [alertMessage, setAlertMessage] = useState<string>('');
//     const [alertVariant, setAlertVariant] = useState<'info' | 'success' | 'error'>('info');

//     const queryClient = useQueryClient();

//     // fallbacks
//     const fallbackBairros: string[] = [
//         'Abolição', 'Acari', 'Água Santa', 'Alto da Boa Vista', 'Anchieta', 'Andaraí', 'Anil',
//         'Bairro Imperial de São Cristóvão', 'Bancários', 'Bangu', 'Barra da Tijuca', 'Barra de Guaratiba',
//         'Barros Filho', 'Benfica', 'Bento Ribeiro', 'Bonsucesso', 'Botafogo', 'Brás de Pina',
//         'Cachambi', 'Cacuia', 'Caju', 'Camorim', 'Campinho', 'Campo dos Afonsos', 'Campo Grande',
//         'Cascadura', 'Catete', 'Catumbi', 'Cavalcanti', 'Centro', 'Cidade de Deus', 'Cidade Nova',
//         'Copacabana', 'Flamengo', 'Ipanema', 'Leblon', 'Tijuca', 'Vila Isabel', 'Madureira',
//         'Méier', 'Penha', 'Realengo', 'Santa Cruz', 'São Conrado', 'Recreio dos Bandeirantes'
//     ];

//     const fallbackTipos = [
//         { value: 'Criação', label: 'Novo Cadastro' },
//         { value: 'Atualização', label: 'Atualização Cadastral' }
//     ];

//     const fallbackDatas = [
//         '2025-08-10', '2025-08-11', '2025-08-12', '2025-08-13', '2025-08-14',
//         '2025-08-17', '2025-08-18', '2025-08-19', '2025-08-20', '2025-08-21',
//         '2025-08-24', '2025-08-25', '2025-08-26', '2025-08-27', '2025-08-28'
//     ];

//     const fallbackHorarios = [
//         '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
//         '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
//     ];

















//     // Queries (objeto-style, compatível com várias versões do tanstack)
//     const bairrosQuery = useQuery<string[]>({
//         queryKey: ['bairros'],
//         queryFn: async () => {
//             const { data } = await api.get('/bairros');
//             return data;
//         },
//         staleTime: 1000 * 60 * 5,
//         retry: 1,
//         initialData: fallbackBairros
//     });

//     const unidadesQuery = useQuery<Unidade[]>({
//         queryKey: ['unidades', formData.bairro],
//         queryFn: async () => {
//             const { data } = await api.get('/unidades', { params: { bairro: formData.bairro } });
//             return data;
//         },
//         enabled: !!formData.bairro,
//         staleTime: 1000 * 60,
//         retry: 1
//     });

//     const datasQuery = useQuery<string[]>({
//         queryKey: ['datas', formData.unidade],
//         queryFn: async () => {
//             const { data } = await api.get('/datas', { params: { unidade: formData.unidade } });
//             return data;
//         },
//         enabled: !!formData.unidade,
//         staleTime: 1000 * 60,
//         retry: 1,
//         initialData: fallbackDatas
//     });

//     const horariosQuery = useQuery<string[]>({
//         queryKey: ['horarios', formData.unidade, formData.data],
//         queryFn: async () => {
//             const { data } = await api.get('/horarios', { params: { unidade: formData.unidade, data: formData.data } });
//             return data;
//         },
//         enabled: !!formData.unidade && !!formData.data,
//         staleTime: 1000 * 60,
//         retry: 1,
//         initialData: fallbackHorarios
//     });

//     // GET /agendamento/{cpf} (manual)
//     const agendamentoQuery = useQuery<AgendamentoResponse>({
//         queryKey: ['agendamento', formData.cpf],
//         queryFn: async () => {
//             const { data } = await api.get(`/agendamento/${formData.cpf}`);
//             console.log('Dados do agendamento:', data);
//             return data;
//         },
//         enabled: false,
//         retry: false
//     });

//     // Mutation POST /agendamento
//     const createAgendamento = async (payload: FormDataType): Promise<AgendamentoResponse> => {
//         const { data } = await api.post('/agendamento', payload);
//         return data;
//     };

//     const mutation = useMutation<AgendamentoResponse, unknown, FormDataType>({
//         mutationFn: createAgendamento,
//         onSuccess: (data) => {
//             setSubmitResult(data?.message ?? 'Agendamento confirmado.');
//             // invalida queries relacionadas (objeto-style)
//             queryClient.invalidateQueries({ queryKey: ['agendamento'] });
//         },
//         onError: (err: any) => {
//             if (err?.response?.status === 422 && err.response.data?.errors) {
//                 const apiErrors = err.response.data.errors;
//                 const mapped: { [k: string]: string } = {};
//                 for (const key in apiErrors) {
//                     if (Array.isArray(apiErrors[key]) && apiErrors[key].length) {
//                         mapped[key] = apiErrors[key][0];
//                     } else {
//                         mapped[key] = String(apiErrors[key]);
//                     }
//                 }
//                 setErrors(prev => ({ ...prev, ...mapped }));
//             } else {
//                 setSubmitResult('Erro ao enviar. Tente novamente mais tarde.');
//             }
//         }
//     });


















//     // ---------------- helpers (format/validate)
//     const formatCPF = (value: string) => {
//         const numbers = value.replace(/\D/g, '');
//         if (numbers.length <= 11) {
//             return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
//         }
//         return value;
//     };

//     const formatPhone = (value: string) => {
//         const numbers = value.replace(/\D/g, '');
//         if (numbers.length === 11) {
//             return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
//         } else if (numbers.length === 10) {
//             return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
//         }
//         return value;
//     };

//     const validateCPF = (cpf: string) => {
//         const numbers = cpf.replace(/\D/g, '');
//         if (numbers.length !== 11) return false;
//         if (/^(\d)\1{10}$/.test(numbers)) return false;
//         let sum = 0;
//         for (let i = 0; i < 9; i++) sum += parseInt(numbers.charAt(i)) * (10 - i);
//         let remainder = (sum * 10) % 11;
//         if (remainder === 10 || remainder === 11) remainder = 0;
//         if (remainder !== parseInt(numbers.charAt(9))) return false;
//         sum = 0;
//         for (let i = 0; i < 10; i++) sum += parseInt(numbers.charAt(i)) * (11 - i);
//         remainder = (sum * 10) % 11;
//         if (remainder === 10 || remainder === 11) remainder = 0;
//         if (remainder !== parseInt(numbers.charAt(10))) return false;
//         return true;
//     };

//     const validatePhone = (phone: string, isRequired: boolean = true) => {
//         if (!isRequired && !phone.trim()) return true;
//         const numbers = phone.replace(/\D/g, '');
//         if (!numbers.startsWith('21')) return false;
//         return numbers.length === 11 || numbers.length === 10;
//     };

//     const isFieldValid = (field: string, value: string) => {
//         switch (field) {
//             case 'cpf':
//                 return validateCPF(value);
//             case 'nome':
//                 return value.trim().length >= 3 && /^[a-zA-ZÀ-ÿ\s]+$/.test(value.trim());
//             case 'celular':
//                 return validatePhone(value, true);
//             case 'telefone':
//                 return validatePhone(value, false);
//             case 'tipo':
//             case 'bairro':
//             case 'unidade':
//             case 'data':
//             case 'horario':
//                 return value !== '';
//             default:
//                 return true;
//         }
//     };

//     const getNextStage = (field: string) => {
//         const stageMap: { [key: string]: number } = {
//             'cpf': 1,
//             'nome': 2,
//             'celular': 3,
//             'telefone': 4,
//             'tipo': 5,
//             'bairro': 6,
//             'unidade': 7,
//             'data': 8,
//             'horario': 9
//         };
//         return stageMap[field] ?? currentStage;
//     };

//     const getUnidadesDisponiveis = (): Unidade[] => {
//         return unidadesQuery.data ?? [
//             { value: 'cras-generico', label: 'CRAS - Unidade Local', endereco: `Unidade de atendimento no bairro ${formData.bairro}` }
//         ];
//     };

//     const getEnderecoUnidade = () => {
//         const unidades = getUnidadesDisponiveis();
//         const unidadeSelecionada = unidades.find(u => u.value === formData.unidade);
//         return unidadeSelecionada?.endereco || '';
//     };

//     const formatDate = (dateString: string) => {
//         if (!dateString) return '';
//         const date = new Date(dateString + 'T00:00:00');
//         return date.toLocaleDateString('pt-BR', {
//             weekday: 'long',
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//         });
//     };

//     const canShowStage = (stage: number) => currentStage >= stage;





//     // handlers
//     const handleInputChange = (field: string, value: string) => {
//         setFormData(prev => ({ ...prev, [field]: value }));
//         setErrors(prev => ({ ...prev, [field]: '' }));

//         if (isFieldValid(field, value)) {
//             const nextStage = getNextStage(field);
//             if (nextStage > currentStage) {
//                 setTimeout(() => setCurrentStage(nextStage), 300);
//             }
//         } else {
//             if (value && value.length > 0) {
//                 setErrors(prev => ({ ...prev, [field]: `O campo ${field} está inválido.` }));
//             } else {
//                 setErrors(prev => ({ ...prev, [field]: '' }));
//             }
//         }
//     };






//     // onBlur do CPF: valida e refetch manualmente
//     const handleCPFBlur = async () => {
//         setAlertVisible(false);
//         setCpfAPIResult('');
//         setAlertMessage('');
//         console.log('Chegou no onBlur do CPF:', formData.cpf);

//         if (!validateCPF(formData.cpf)) {
//             setErrors(prev => ({ ...prev, cpf: 'CPF inválido' }));
//             console.log('CPF inválido, não faz requisição.');
//             return;
//         }

//         try {
//             // Forçar a query a recarregar e aguardar o resultado
//             const result = await agendamentoQuery.refetch();

//             // Verificar manualmente se a resposta contém um erro
//             if (result.status === 'error') {
//                 throw new Error(result.error?.message || 'Erro ao consultar CPF');
//             }

//             const data = result.data;
//             console.log('Resposta da API para o CPF:', data?.message);

//             if (data?.message) {
//                 setAlertVisible(true);
//                 setAlertMessage(data.message);
//                 setAlertVariant('info');
//             }

//             if (data?.nome) {
//                 setFormData(prev => ({ ...prev, nome: String(data.nome) }));
//             }
//         } catch (err: any) {
//             console.error('Erro na requisição:', err);
//             const apiMsg = err?.message ?? 'Erro ao consultar disponibilidade. Tente novamente.';
//             console.log(`API Message: ${apiMsg}`);
//             setAlertVisible(true);
//             setAlertMessage(apiMsg);
//             setAlertVariant('error');
//         }
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         setSubmitResult(null);

//         const invalidFields: { [k: string]: string } = {};
//         (Object.keys(formData) as Array<keyof FormDataType>).forEach((k) => {
//             if (!isFieldValid(k as string, String(formData[k]))) {
//                 invalidFields[k as string] = `Campo ${k} inválido ou obrigatório.`;
//             }
//         });

//         if (Object.keys(invalidFields).length) {
//             setErrors(prev => ({ ...prev, ...invalidFields }));
//             const firstInvalid = Object.keys(invalidFields)[0];
//             const nextStage = getNextStage(firstInvalid);
//             setCurrentStage(nextStage);
//             return;
//         }

//         mutation.mutate(formData);
//     };

//     useEffect(() => {
//         if (agendamentoQuery.data?.message) {
//             setAlertMessage(agendamentoQuery.data.message);
//             setAlertVariant('info');
//             setAlertVisible(true);
//         }
//     }, [agendamentoQuery.data]);

//     // mutation loading flag (compatibilidade TS entre versões)
//     const mutationIsLoading = (mutation as any).isLoading ?? false;











//     return (
//         <div className="space-y-8">
//             <div className="text-center mb-8">
//                 <h2 className="text-4xl font-bold text-gray-800 mb-3">Agendamento Cadastro Único</h2>
//                 <h3 className="text-xl text-gray-600 font-medium">O Atendimento é destinado para o município do Rio de Janeiro</h3>
//             </div>

//             <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8"></div>

//             <form className="space-y-8" onSubmit={handleSubmit}>
//                 {/* Dados Pessoais */}
//                 <AlertBox
//                     visible={alertVisible}
//                     message={alertMessage}
//                     variant={alertVariant}
//                     onClose={() => setAlertVisible(false)}
//                 />
//                 <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
//                     <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
//                         <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
//                         Dados Pessoais
//                     </h3>

//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {/* CPF */}
//                         <CampoInput
//                             label="CPF"
//                             placeholder="000.000.000-00"
//                             value={formData.cpf}
//                             onChange={(value) => handleInputChange('cpf', formatCPF(value))}
//                             onBlur={handleCPFBlur}
//                             error={errors.cpf}
//                             required
//                             maxLength={14}
//                             visible={canShowStage(0)}
//                             inputMode="numeric"
//                         />
//                         {cpfAPIResult && <p className="text-sm text-blue-600">{cpfAPIResult}</p>}

//                         {/* Nome */}
//                         {canShowStage(1) && (
//                             <CampoInput
//                                 label="Nome Completo"
//                                 placeholder="Informe seu nome completo"
//                                 value={formData.nome}
//                                 onChange={(value) => handleInputChange('nome', value)}
//                                 error={errors.nome}
//                                 required
//                                 visible={true}
//                             />
//                         )}

//                         {/* Celular */}
//                         {canShowStage(2) && (
//                             <CampoInput
//                                 label="Celular"
//                                 placeholder="(21) 99999-9999"
//                                 value={formData.celular}
//                                 onChange={(value) => handleInputChange('celular', formatPhone(value))}
//                                 error={errors.celular}
//                                 required
//                                 maxLength={15}
//                                 visible={true}
//                                 inputMode="numeric"
//                             />
//                         )}

//                         {/* Telefone */}
//                         {canShowStage(3) && (
//                             <CampoInput
//                                 label="Telefone Fixo (Opcional)"
//                                 placeholder="(21) 3333-3333"
//                                 value={formData.telefone}
//                                 onChange={(value) => handleInputChange('telefone', formatPhone(value))}
//                                 maxLength={15}
//                                 visible={true}
//                                 inputMode="numeric"
//                             />
//                         )}

//                         {/* Tipo */}
//                         {canShowStage(4) && (
//                             <CampoSelect
//                                 label="Tipo de Atendimento"
//                                 value={formData.tipo}
//                                 onChange={(value) => handleInputChange('tipo', value)}
//                                 options={fallbackTipos}
//                                 error={errors.tipo}
//                                 required
//                                 visible={true}
//                             />
//                         )}

//                         {/* Bairro */}
//                         {canShowStage(5) && (
//                             <CampoSelect
//                                 label="Bairro de Moradia"
//                                 value={formData.bairro}
//                                 onChange={(value) => handleInputChange('bairro', value)}
//                                 options={(bairrosQuery.data || fallbackBairros).map((b: string) => ({ value: b, label: b }))}
//                                 error={errors.bairro}
//                                 required
//                                 visible={true}
//                             />
//                         )}
//                     </div>
//                 </div>

//                 {/* Agendamento */}
//                 {canShowStage(6) && (
//                     <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
//                         <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
//                             <div className="w-2 h-6 bg-green-600 rounded-full"></div>
//                             Agendamento
//                         </h3>

//                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                             <div className="space-y-4">
//                                 <div className="flex items-center gap-2 mb-4">
//                                     <MapPin className="h-5 w-5 text-blue-600" />
//                                     <h4 className="text-lg font-semibold text-gray-800">Escolha uma Unidade</h4>
//                                 </div>

//                                 <CampoSelect
//                                     label=""
//                                     value={formData.unidade}
//                                     onChange={(value) => handleInputChange('unidade', value)}
//                                     options={(getUnidadesDisponiveis() as Unidade[]).map((u) => ({ value: u.value, label: u.label }))}
//                                     required
//                                     visible={true}
//                                 />

//                                 {formData.unidade && (
//                                     <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                                         <div className="flex items-start gap-2">
//                                             <MapPin className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
//                                             <div>
//                                                 <p className="text-sm font-medium text-blue-800">Endereço:</p>
//                                                 <p className="text-sm text-blue-700">{getEnderecoUnidade()}</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Data */}
//                             {canShowStage(7) && (
//                                 <div className="space-y-4">
//                                     <div className="flex items-center gap-2 mb-4">
//                                         <Calendar className="h-5 w-5 text-blue-600" />
//                                         <h4 className="text-lg font-semibold text-gray-800">Escolha a Data</h4>
//                                     </div>

//                                     <div className="grid grid-cols-3 gap-2">
//                                         {(datasQuery.data || fallbackDatas).map((data) => (
//                                             <button
//                                                 key={data}
//                                                 type="button"
//                                                 onClick={() => handleInputChange('data', data)}
//                                                 className={`p-3 text-sm rounded-lg border transition-all duration-200 ${formData.data === data
//                                                     ? 'bg-blue-600 text-white border-blue-600 shadow-md'
//                                                     : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
//                                                     }`}
//                                             >
//                                                 {new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
//                                             </button>
//                                         ))}
//                                     </div>

//                                     {formData.data && (
//                                         <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
//                                             <p className="text-sm text-green-800 font-medium">
//                                                 Data selecionada: {formatDate(formData.data)}
//                                             </p>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}

//                             {/* Horário */}
//                             {canShowStage(8) && (
//                                 <div className="space-y-4">
//                                     <div className="flex items-center gap-2 mb-4">
//                                         <Clock className="h-5 w-5 text-blue-600" />
//                                         <h4 className="text-lg font-semibold text-gray-800">Escolha o Horário</h4>
//                                     </div>

//                                     <div className="grid grid-cols-2 gap-2">
//                                         {(horariosQuery.data || fallbackHorarios).map((horario) => (
//                                             <button
//                                                 key={horario}
//                                                 type="button"
//                                                 onClick={() => handleInputChange('horario', horario)}
//                                                 className={`p-3 text-sm rounded-lg border transition-all duration-200 ${formData.horario === horario
//                                                     ? 'bg-green-600 text-white border-green-600 shadow-md'
//                                                     : 'bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50'
//                                                     }`}
//                                             >
//                                                 {horario}
//                                             </button>
//                                         ))}
//                                     </div>

//                                     {formData.horario && (
//                                         <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
//                                             <p className="text-sm text-green-800 font-medium">
//                                                 Horário selecionado: {formData.horario}
//                                             </p>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 {/* Confirmação */}
//                 {canShowStage(9) && (
//                     <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
//                         <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
//                             <div className="w-2 h-6 bg-purple-600 rounded-full"></div>
//                             Confirmação do Agendamento
//                         </h3>

//                         <div className="bg-gray-50 p-6 rounded-lg mb-6">
//                             <h4 className="font-semibold text-gray-800 mb-4">Resumo do Agendamento:</h4>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                                 <div><strong>Nome:</strong> {formData.nome}</div>
//                                 <div><strong>CPF:</strong> {formData.cpf}</div>
//                                 <div><strong>Tipo:</strong> {formData.tipo}</div>
//                                 <div><strong>Bairro:</strong> {formData.bairro}</div>
//                                 <div><strong>Data:</strong> {formatDate(formData.data)}</div>
//                                 <div><strong>Horário:</strong> {formData.horario}</div>
//                             </div>
//                         </div>

//                         <div className="mb-6">
//                             <div className="bg-gray-100 p-4 rounded-lg inline-block">
//                                 <p className="text-sm text-gray-600">reCAPTCHA será exibido aqui</p>
//                             </div>
//                         </div>

//                         <div className="text-center">
//                             <button
//                                 type="submit"
//                                 className="bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-8 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-lg"
//                                 disabled={mutationIsLoading}
//                             >
//                                 {mutationIsLoading ? 'Enviando...' : 'Confirmar Agendamento'}
//                             </button>
//                             {submitResult && <p className="mt-3 text-sm text-green-700">{submitResult}</p>}
//                         </div>
//                     </div>
//                 )}
//             </form>
//         </div>
//     );
// };

// export default FormularioEtapas;
