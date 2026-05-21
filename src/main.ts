import "./style.css";


type TipoIva =
  | "general"
  | "reducido"
  | "superreducidoA"
  | "superreducidoB"
  | "superreducidoC"
  | "sinIva";

interface Producto {
  nombre: string;
  precio: number;
  tipoIva: TipoIva;
}

interface LineaTicket {
  producto: Producto;
  cantidad: number;
}

interface ResultadoLineaTicket {
  nombre: string;
  cantidad: number;
  precionSinIva: number;
  tipoIva: TipoIva;
  precioConIva: number;
}

interface ResultadoTotalTicket {
  totalSinIva: number;
  totalConIva: number;
  totalIva: number;
}

interface TotalPorTipoIva {
  tipoIva: TipoIva;
  cuantia: number;
}

interface TicketFinal {
  lineas: ResultadoLineaTicket[];
  total: ResultadoTotalTicket;
  desgloseIva: TotalPorTipoIva[];
} 

const redondear = (valor: number): number =>
  parseFloat(valor.toFixed(2));



const getPorcentajeIva = (tipoIva: TipoIva): number => {
  switch (tipoIva) {
    case "general":        return 21;
    case "reducido":       return 10;
    case "superreducidoA": return 5;
    case "superreducidoB": return 4;
    case "superreducidoC": return 0;
    case "sinIva":         return 0;
  }
};

const calcularLineaTicket = (linea: LineaTicket): ResultadoLineaTicket => {
  const { producto, cantidad } = linea;
  const porcentaje = getPorcentajeIva(producto.tipoIva);
  const precionSinIva = redondear(producto.precio * cantidad);
  const precioConIva = redondear(precionSinIva * (1 + porcentaje / 100));

  return {
    nombre: producto.nombre,
    cantidad,
    precionSinIva,
    tipoIva: producto.tipoIva,
    precioConIva,
  };
};

const calculaTicket = (lineasTicket: LineaTicket[]): TicketFinal => {
  const lineas = lineasTicket.map(calcularLineaTicket); // he utilizado map en vez del for

  const totalSinIva = redondear(lineas.reduce((acc, linea) => acc + linea.precionSinIva, 0)); // reduce recorre todas las líneas y las agrupa por tipo de IVA
  const totalConIva = redondear(lineas.reduce((acc, linea) => acc + linea.precioConIva, 0));
  const totalIva = redondear(totalConIva - totalSinIva);

  const desgloseIva = lineas.reduce<TotalPorTipoIva[]>((acc, linea) => {
    const entrada = acc.find((item) => item.tipoIva === linea.tipoIva);
    if (entrada) {
      entrada.cuantia = redondear(entrada.cuantia + (linea.precioConIva - linea.precionSinIva));
    } else {
      acc.push({ tipoIva: linea.tipoIva, cuantia: redondear(linea.precioConIva - linea.precionSinIva) });
    }
    return acc;
  }, []);

  return { lineas, total: { totalSinIva, totalConIva, totalIva }, desgloseIva };
};

const productos: LineaTicket[] = [
  { producto: { nombre: "Legumbres", precio: 2, tipoIva: "general" }, cantidad: 2 },
  { producto: { nombre: "Perfume", precio: 20, tipoIva: "general" }, cantidad: 3 },
  { producto: { nombre: "Leche", precio: 1, tipoIva: "superreducidoC" }, cantidad: 6 },
  { producto: { nombre: "Lasaña", precio: 5, tipoIva: "superreducidoA" }, cantidad: 1 },
];


const ticket = calculaTicket(productos);

document.body.innerHTML = `<pre>${JSON.stringify(ticket, null, 2)}</pre>`; // esta vez he sustituido el console.log 