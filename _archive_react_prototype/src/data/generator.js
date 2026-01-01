
// Base de Datos de Productos Simulada
const PRODUCTS = [
    { id: 'p1', name: 'MacBook Pro M3', category: 'Electrónica', price: 1599, cost: 1100 },
    { id: 'p2', name: 'iPhone 15 Pro', category: 'Electrónica', price: 999, cost: 750 },
    { id: 'p3', name: 'Sony WH-1000XM5', category: 'Audio', price: 349, cost: 200 },
    { id: 'p4', name: 'Samsung S24 Ultra', category: 'Electrónica', price: 1299, cost: 900 },
    { id: 'p5', name: 'iPad Air', category: 'Electrónica', price: 599, cost: 400 },
    { id: 'p6', name: 'Silla Herman Miller', category: 'Hogar', price: 1200, cost: 700 },
    { id: 'p7', name: 'Escritorio Elevable', category: 'Hogar', price: 450, cost: 250 },
    { id: 'p8', name: 'Nike Air Max', category: 'Ropa', price: 150, cost: 60 },
    { id: 'p9', name: 'Adidas Ultraboost', category: 'Ropa', price: 180, cost: 80 },
    { id: 'p10', name: 'Aspiradora Dyson', category: 'Hogar', price: 600, cost: 350 },
    { id: 'p11', name: 'Teclado Mecánico', category: 'Electrónica', price: 120, cost: 70 },
    { id: 'p12', name: 'Monitor Gaming', category: 'Electrónica', price: 400, cost: 280 },
    { id: 'p13', name: 'Mat de Yoga', category: 'Deportes', price: 40, cost: 10 },
    { id: 'p14', name: 'Proteína Whey', category: 'Deportes', price: 60, cost: 30 },
    { id: 'p15', name: 'Set de Mancuernas', category: 'Deportes', price: 200, cost: 100 },
];

const CUSTOMERS = [
    "Juan Pérez", "María García", "Carlos López", "Ana Martínez", "Luis Gonza",
    "Elena Torres", "Miguel Ángel", "Sofía Ruiz", "David Villa", "Lucía Díaz"
];

const STATUSES = ["Completado", "Completado", "Completado", "Procesando", "Cancelado"];
const MONTHS_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export const generateData = () => {
    const transactions = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1); // Últimos 12 meses

    let currentDate = new Date(startDate);

    // 1. Bucle de Generación
    while (currentDate <= endDate) {
        // Más órdenes en fines de semana
        const day = currentDate.getDay();
        const baseOrders = (day === 0 || day === 6) ? 15 : 8;
        const randomVariation = Math.floor(Math.random() * 10);
        const dailyOrders = baseOrders + randomVariation;

        for (let i = 0; i < dailyOrders; i++) {
            const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
            const customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
            const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];

            transactions.push({
                id: Math.random().toString(36).substr(2, 9),
                date: new Date(currentDate), // Clonar fecha
                customer,
                product: product.name,
                category: product.category,
                amount: product.price,
                cost: product.cost,
                status
            });
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Ordenar descendente
    transactions.sort((a, b) => b.date - a.date);

    return transactions;
};

// --- Helpers de Agrupación ---

// Agrupar por Día (para rangos cortos)
export const aggregateSalesByDay = (transactions) => {
    const days = {};
    const sortedTx = [...transactions].sort((a, b) => a.date - b.date);

    sortedTx.forEach(t => {
        if (t.status === 'Cancelado') return;
        const dayKey = t.date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }); // 01/01

        if (!days[dayKey]) days[dayKey] = { revenue: 0, profit: 0, name: dayKey };

        days[dayKey].revenue += t.amount;
        days[dayKey].profit += (t.amount - t.cost);
    });

    return Object.values(days);
};

// Agrupar por Mes (para rangos largos)
export const aggregateSalesByMonth = (transactions) => {
    const months = {};
    const sortedTx = [...transactions].sort((a, b) => a.date - b.date);

    sortedTx.forEach(t => {
        if (t.status === 'Cancelado') return;
        const date = t.date;
        const monthKey = `${MONTHS_ES[date.getMonth()]} ${date.getFullYear().toString().substr(2)}`; // Ene 23

        if (!months[monthKey]) months[monthKey] = { revenue: 0, profit: 0, name: monthKey };

        months[monthKey].revenue += t.amount;
        months[monthKey].profit += (t.amount - t.cost);
    });

    return Object.values(months);
};

// Estadísticas Generales
export const aggregateStats = (transactions) => {
    const completed = transactions.filter(t => t.status !== 'Cancelado');

    const totalRevenue = completed.reduce((sum, t) => sum + t.amount, 0);
    const totalProfit = completed.reduce((sum, t) => sum + (t.amount - t.cost), 0);
    const totalOrders = transactions.length;
    const avgOrder = completed.length ? totalRevenue / completed.length : 0;
    const uniqueCustomers = new Set(completed.map(t => t.customer)).size;

    return {
        revenue: totalRevenue,
        orders: totalOrders,
        avgOrder,
        activeCustomers: uniqueCustomers // Multiplicador visual ya no es tan necesario si hay 5k datos
    };
};

// Categorías para Donut
export const aggregateCategories = (transactions) => {
    const cats = {};
    transactions.forEach(t => {
        if (t.status === 'Cancelado') return;
        if (!cats[t.category]) cats[t.category] = 0;
        cats[t.category] += t.amount; // Sumar Revenue, no count (más interesante)
    });

    const colors = { 'Electrónica': '#3b82f6', 'Ropa': '#10b981', 'Hogar': '#f59e0b', 'Audio': '#8b5cf6', 'Deportes': '#ec4899' };

    return Object.keys(cats).map(key => ({
        name: key,
        value: cats[key],
        color: colors[key] || '#94a3b8'
    })).sort((a, b) => b.value - a.value);
};

// Top Products para Barra Horizontal
export const getTopProducts = (transactions) => {
    const products = {};
    transactions.forEach(t => {
        if (t.status === 'Cancelado') return;
        if (!products[t.product]) products[t.product] = 0;
        products[t.product] += t.amount;
    });

    return Object.keys(products)
        .map(key => ({ name: key, revenue: products[key] }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
};
