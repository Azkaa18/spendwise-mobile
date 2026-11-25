const ago = (days, hour = 13) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 15, 0, 0);
  return d.toISOString();
};

export function sampleData() {
  const t = (id, type, amount, category, note, days) => ({ id: `s${id}`, type, amount, category, note, date: ago(days) });
  return {
    name: 'Azka',
    currency: 'PKR',
    budgets: { Food: 25000, Transport: 9000, Shopping: 15000, Bills: 18000, Entertainment: 6000 },
    transactions: [
      t(1, 'expense', 1850, 'Food', 'Lunch with team', 0),
      t(2, 'expense', 650, 'Transport', 'Careem to office', 0),
      t(3, 'expense', 4200, 'Shopping', 'Running shoes (sale)', 1),
      t(4, 'expense', 12400, 'Bills', 'Electricity bill', 2),
      t(5, 'income', 35000, 'Freelance', 'Landing page project', 3),
      t(6, 'expense', 2300, 'Entertainment', 'Cinema + snacks', 4),
      t(7, 'expense', 5600, 'Food', 'Monthly groceries', 5),
      t(8, 'expense', 3100, 'Health', 'Pharmacy', 6),
      t(9, 'expense', 900, 'Transport', 'Fuel top-up', 7),
      t(10, 'expense', 8500, 'Education', 'Data Science course book', 8),
      t(11, 'income', 180000, 'Salary', 'Monthly salary', 9),
      t(12, 'expense', 2750, 'Food', 'Dinner out', 10),
      t(13, 'expense', 3900, 'Bills', 'Internet', 12),
      t(14, 'expense', 6800, 'Shopping', 'Gift for sister', 14),
      t(15, 'expense', 1200, 'Transport', 'Bykea rides', 16),
      t(16, 'expense', 4100, 'Food', 'Groceries', 19),
      t(17, 'expense', 16000, 'Bills', 'Rent share', 34),
      t(18, 'income', 180000, 'Salary', 'Monthly salary', 39),
      t(19, 'expense', 9800, 'Shopping', 'Clothes', 41),
      t(20, 'expense', 14500, 'Food', 'Groceries + dining', 44),
    ],
  };
}
