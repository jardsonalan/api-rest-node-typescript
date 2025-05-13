// Seeds: Função que automatiza o processo de inserção de dados no banco de dados
// Sempre são executadas a cada inicialização
import { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export const seed = async (knex: Knex) => {
  // Serve para verificar se tem registros inseridos na tabela de cidades
  const [{ count }] = await knex(ETableNames.cidade).count<[{count: number}]>('* as count')
  // Verifica se já tem registros inseridos na tabela
  // Se já existir, não insere mais cidades
  if (!Number.isInteger(count) || Number(count) > 0) return

  // Lista de objetos com as cidades que serão inseridas na tabela cidades
  const cidadesToInsert = cidadesRioGrandeDoNorte.map(nomeDaCidade => ({ nome: nomeDaCidade }))

  await knex(ETableNames.cidade).insert(cidadesToInsert)
}

const cidadesRioGrandeDoNorte = [
  "Acari", "Açu", "Afonso Bezerra", "Água Nova", "Alexandria", "Almino Afonso",
  "Alto do Rodrigues", "Angicos", "Antônio Martins", "Apodi", "Areia Branca",
  "Arês", "Baía Formosa", "Baraúna", "Barcelona", "Bento Fernandes", "Bodó",
  "Bom Jesus", "Brejinho", "Caiçara do Norte", "Caiçara do Rio do Vento",
  "Caicó", "Campo Redondo", "Canguaretama", "Caraúbas", "Carnaúba dos Dantas",
  "Carnaubais", "Ceará-Mirim", "Cerro Corá", "Coronel Ezequiel", "Coronel João Pessoa",
  "Cruzeta", "Currais Novos", "Doutor Severiano", "Encanto", "Equador", "Espírito Santo",
  "Extremoz", "Felipe Guerra", "Fernando Pedroza", "Florânia", "Francisco Dantas",
  "Frutuoso Gomes", "Galinhos", "Goianinha", "Governador Dix-Sept Rosado", "Grossos",
  "Guamaré", "Ielmo Marinho", "Ipanguaçu", "Ipueira", "Itajá", "Itaú", "Jaçanã",
  "Jandaíra", "Janduís", "Januário Cicco", "Japi", "Jardim de Angicos",
  "Jardim de Piranhas", "Jardim do Seridó", "João Câmara", "João Dias", "José da Penha",
  "Jucurutu", "Jundiá", "Lagoa d'Anta", "Lagoa de Pedras", "Lagoa de Velhos",
  "Lagoa Nova", "Lagoa Salgada", "Lajes", "Lajes Pintadas", "Lucrécia", "Luís Gomes",
  "Macaíba", "Macau", "Major Sales", "Marcelino Vieira", "Martins", "Maxaranguape",
  "Messias Targino", "Montanhas", "Monte Alegre", "Monte das Gameleiras",
  "Mossoró", "Natal", "Nísia Floresta", "Nova Cruz", "Olho-d'Água do Borges",
  "Ouro Branco", "Paraná", "Paraú", "Parazinho", "Parelhas", "Parnamirim",
  "Passa e Fica", "Passagem", "Patu", "Pau dos Ferros", "Pedra Grande", "Pedra Preta",
  "Pedro Avelino", "Pedro Velho", "Pendências", "Pilões", "Poço Branco", "Portalegre",
  "Porto do Mangue", "Presidente Juscelino", "Pureza", "Rafael Fernandes",
  "Rafael Godeiro", "Riacho da Cruz", "Riacho de Santana", "Riachuelo", "Rio do Fogo",
  "Rodolfo Fernandes", "Ruy Barbosa", "Santa Cruz", "Santa Maria", "Santana do Matos",
  "Santana do Seridó", "Santo Antônio", "São Bento do Norte", "São Bento do Trairí",
  "São Fernando", "São Francisco do Oeste", "São Gonçalo do Amarante",
  "São João do Sabugi", "São José de Mipibu", "São José do Campestre",
  "São José do Seridó", "São Miguel", "São Miguel do Gostoso", "São Paulo do Potengi",
  "São Pedro", "São Rafael", "São Tomé", "São Vicente", "Senador Elói de Souza",
  "Senador Georgino Avelino", "Serra Caiada", "Serra de São Bento", "Serra do Mel",
  "Serra Negra do Norte", "Serrinha", "Serrinha dos Pintos", "Severiano Melo",
  "Sítio Novo", "Taboleiro Grande", "Taipu", "Tangará", "Tenente Ananias",
  "Tenente Laurentino Cruz", "Tibau", "Tibau do Sul", "Timbaúba dos Batistas",
  "Touros", "Triunfo Potiguar", "Umarizal", "Upanema", "Várzea", "Venha-Ver",
  "Vera Cruz", "Viçosa", "Vila Flor"
];
