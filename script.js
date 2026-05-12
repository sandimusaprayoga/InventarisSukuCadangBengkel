const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx9en3IDhmiHSHyH5HQbdpF6ZhCyQEBt8Nqpm9PKCmL-0AKYcQ0RIg7Wfw11G1xrkCNsA/exec"; // Ganti dengan URL Deployment Anda

const form = document.getElementById('inventory-form');
const tableBody = document.getElementById('table-body');
const loading = document.getElementById('loading');
let inventory = [];

// Fungsi ambil data
async function loadData() {
    loading.style.display = 'block';
    try {
        const res = await fetch(SCRIPT_URL);
        inventory = await res.json();
        renderTable(inventory);
    } catch (e) {
        alert("Gagal mengambil data");
    } finally {
        loading.style.display = 'none';
    }
}

// Fungsi tampilkan tabel
function renderTable(data) {
    tableBody.innerHTML = data.map(item => `
        <tr>
            <td>${item.kode}</td>
            <td>${item.nama}</td>
            <td class="${item.stok < 5 ? 'stok-low' : ''}">${item.stok}</td>
            <td>Rp ${parseInt(item.harga).toLocaleString('id-ID')}</td>
        </tr>
    `).join('');
}

// Fungsi Input Data (POST)
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    btn.innerText = "Mengirim...";
    btn.disabled = true;

    const newData = {
        kode: document.getElementById('kode').value,
        nama: document.getElementById('nama').value,
        stok: document.getElementById('stok').value,
        harga: document.getElementById('harga').value
    };

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(newData)
        });
        form.reset();
        await loadData(); // Refresh data setelah input berhasil
    } catch (e) {
        alert("Gagal menyimpan data");
    } finally {
        btn.innerText = "Simpan Barang";
        btn.disabled = false;
    }
});

// Pencarian
document.getElementById('search').addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    const filtered = inventory.filter(i => 
        i.nama.toLowerCase().includes(val) || i.kode.toLowerCase().includes(val)
    );
    renderTable(filtered);
});

loadData();
