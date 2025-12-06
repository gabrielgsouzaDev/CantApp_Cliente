// ======================================================
// DATA TYPES — Alinhados com Laravel e services.ts
// ======================================================

// -------------------------
// IMAGE & CATEGORY
// -------------------------

export type Image = {
  id: string;
  imageUrl: string;
  imageHint: string;
  description: string;
};

export type Category = 'Salgado' | 'Doce' | 'Bebida' | 'Almoço';

// -------------------------
// USER — Modelo COMPLETO
// -------------------------

export type User = {
  id: string;
  walletId: string | null;
  name: string;
  email: string;
  role: 'Aluno' | 'Responsavel' | 'Admin' | 'Cantina' | 'Escola';
  balance: number; // R6: Alerta de number/float
  schoolId: string | null;
  canteenId: string | null;
  students: User[];
  telefone: string | null;
  data_nascimento: string | null;
  ativo: boolean;
  student_code: string | null;
};

// -------------------------
// PERFIS — Dados reduzidos
// -------------------------

export type StudentProfile = {
  id: string;
  name: string;
  walletId: string | null;
  balance: number;
  student_code: string | null;
  schoolId: string | null;
};

// PERFIL COMPLETO DO RESPONSÁVEL
export type GuardianProfile = {
  id: string;
  name: string;
  walletId: string | null;
  balance: number;
  students: StudentLite[];
};

// -------------------------
// SCHOOL / CANTEEN
// -------------------------

export type School = {
  id: string;
  name: string;
  cnpj: string | null;
  status: 'ativa' | 'inativa' | 'pendente';
  qtd_alunos: number;
};

export type Canteen = {
  id: string;
  name: string;
  schoolId: string;
  hr_abertura: string;
  hr_fechamento: string;
  produtos: Product[];
};

// -------------------------
// PRODUCTS + FAVORITES
// -------------------------

export type Product = {
  id: string;
  canteenId: string;
  name: string;
  price: number;
  ativo: boolean;
  image: Image;
  category: Category;
  popular: boolean;
};

export type Favorite = {
  id: string;
  userId: string;
  productId: string;
  product?: Product;
};

// -------------------------
// ORDERS
// -------------------------

// CRÍTICO R13: A interface DEVE espelhar o que o Backend espera para ENVIO e RECEBIMENTO.
// Tipos de ENVIO (Payload)
export type OrderItemPayload = {
  product_id: string; // CRÍTICO: Removido '?' e camelCase. Obrigatório no ENVIO.
  quantity: number;
  unit_price: number; // CRÍTICO: Removido '?' e camelCase. Obrigatório no ENVIO.
};

// Tipos de RECEBIMENTO (API Response)
export type OrderItem = {
  product_id: string;
  productName: string;
  quantity: number;
  unit_price: number;
  image: Image;
};


export type Order = {
  id: string;
  id_comprador: string; 
  id_destinatario: string; 
  canteenId: string;
  items: OrderItem[];
  total: number;
  date: string; // Data de criação
  status: 'pendente' | 'confirmado' | 'entregue' | 'cancelado' | 'em_preparo' | 'pronto';
};

// -------------------------
// WALLET & TRANSACTIONS
// -------------------------

export type Wallet = {
  id: string;
  userId: string;
  balance: number;
};

export type Transaction = {
  id: string;
  walletId: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  origin: 'PIX' | 'Debito' | 'Estorno' | 'Recarregar' | 'Compra';
  userId: string;
  status: string;
};

// -------------------------
// STUDENT LITE (Retorno real da API)
// -------------------------

export type StudentLite = {
  id: string;
  name: string;
  balance: number; // R6: Alerta de number/float
  walletId: string | null;
  school?: {
    name: string;
  } | null;
};
