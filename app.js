const API_URL = 'http://localhost:3000'; // Ajuste conforme a porta do seu servidor Express

async function carregarEmpresas() {
    const tbody = document.getElementById('lista-empresas');
    if (!tbody) return;

    try {
        const response = await fetch(`${API_URL}/empresas`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro interno do servidor');
        }

        const empresas = await response.json();

        tbody.innerHTML = empresas.map(emp => `
            <tr class="hover:bg-gray-50 transition">
                <td class="p-4 border-b">${emp.nome_social}</td>
                <td class="p-4 border-b font-mono text-sm">${emp.CNPJ_NibocoProd}</td>
                <td class="p-4 border-b">${emp.email || 'N/A'}</td>
                <td class="p-4 border-b">
                    <button class="text-blue-600 hover:text-blue-800 mr-3"><i class="fas fa-edit"></i></button>
                    <button class="text-red-600 hover:text-red-800"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erro detalhado:', error);
        tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-red-500">Erro ao carregar dados.</td></tr>';
    }
}

const formEmpresa = document.getElementById('form-empresa');
if (formEmpresa) {
    formEmpresa.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(formEmpresa);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${API_URL}/empresas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Empresa cadastrada com sucesso!');
                toggleModal();
                carregarEmpresas();
                formEmpresa.reset();
            } else {
                const err = await response.json();
                alert('Erro: ' + (err.error || 'Erro desconhecido'));
            }
        } catch (error) {
            alert('Não foi possível conectar ao servidor.');
        }
    };
}