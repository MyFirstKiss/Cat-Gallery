let cats = [];
let page = 0;
const seenCatIds = new Set(); // ✅ ใช้ Set เก็บ ID แมวที่เคยโหลดมาแล้ว

document.addEventListener('DOMContentLoaded', () => {
    fetchCats();
    createModal();
    loadFonts();
});

// 🌟 ฟังก์ชันดึงข้อมูลแมว พร้อมกรองข้อมูลซ้ำ
async function fetchCats() {
    try {
        document.getElementById('loading').classList.remove('hidden');

        const headers = new Headers({
            "Content-Type": "application/json",
            "x-api-key": "live_BM3mPWacrxo5qLOYzYP3wTvB2wEuHLlu1VmSuf21nWMfCmvgDXpSI0zIJsD0LCDC"
        });

        const response = await fetch(
            `https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=${page}&limit=9`, 
            { method: 'GET', headers: headers }
        );

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('No cat data received from API');
        }

        // ✅ กรองข้อมูลแมวที่ซ้ำ โดยตรวจสอบจาก `cat.id`
        const uniqueCats = data.filter(cat => !seenCatIds.has(cat.id));

        // ✅ บันทึก ID ของแมวที่เพิ่มเข้าไปใหม่ เพื่อป้องกันข้อมูลซ้ำ
        uniqueCats.forEach(cat => seenCatIds.add(cat.id));

        // ✅ เพิ่มแมวที่ไม่ซ้ำลงอาร์เรย์หลัก
        cats = [...cats, ...uniqueCats];
        page++;

        document.getElementById('loading').classList.add('hidden');
        renderCats();
    } catch (error) {
        console.error('Error fetching cats:', error);
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('catGrid').innerHTML = `
            <div class="col-span-full text-center text-red-500 bg-red-100 p-4 rounded-lg">
                ❌ Failed to load cats. ${error.message}
            </div>
        `;
    }
}


function renderCats() {
    const grid = document.getElementById('catGrid');
    grid.innerHTML = '';

    cats.forEach((cat, index) => {
        const card = createCatCard(cat);
        grid.appendChild(card);

        // เพิ่ม Fade-In Animation ให้การ์ดแสดงผลทีละใบ
        setTimeout(() => {
            card.style.opacity = 1;
            card.style.transform = 'translateY(0)';
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        }, index * 100); // หน่วงเวลาแสดงผลทีละการ์ด
    });

    showLoadMoreButton();
}

function createCatCard(cat) {
    const card = document.createElement('div');

    const breedName = cat.breeds?.[0]?.name || 'Unknown Breed';
    let originText = cat.breeds?.[0]?.origin || 'Unknown Origin';
    const temperament = cat.breeds?.[0]?.temperament?.split(', ') || ['Information not available'];
    const description = cat.breeds?.[0]?.description || 'No description available';

    let backgroundColor;
    let flagEmoji = '';

    switch (originText) {
        case 'Canada': 
            flagEmoji = '🍁'; 
            backgroundColor = 'bg-gradient-to-r from-red-600 to-white'; 
            break;
        case 'United States': 
            flagEmoji = '🗽'; 
            backgroundColor = 'bg-gradient-to-r from-blue-500 via-white to-red-500'; 
            break;
        case 'United Kingdom': 
            flagEmoji = '👑'; 
            backgroundColor = 'bg-gradient-to-r from-blue-600 via-red-500 to-white'; 
            break;
        case 'Japan': 
            flagEmoji = '🎌'; 
            backgroundColor = 'bg-gradient-to-r from-white to-red-500'; 
            break;
        case 'Russia': 
            flagEmoji = '🐻'; 
            backgroundColor = 'bg-gradient-to-r from-white via-blue-500 to-red-500'; 
            break;
        case 'Thailand': 
            flagEmoji = '🐘'; 
            backgroundColor = 'bg-gradient-to-r from-blue-600 via-white to-red-500'; 
            break;
        case 'France': 
            flagEmoji = '🥖'; 
            backgroundColor = 'bg-gradient-to-r from-blue-500 via-white to-red-500'; 
            break;
        case 'Germany': 
            flagEmoji = '🍺'; 
            backgroundColor = 'bg-gradient-to-r from-black via-red-500 to-yellow-500'; 
            break;
        case 'Italy': 
            flagEmoji = '🍕'; 
            backgroundColor = 'bg-gradient-to-r from-green-500 via-white to-red-500'; 
            break;
        case 'Brazil': 
            flagEmoji = '🌴'; 
            backgroundColor = 'bg-gradient-to-r from-green-500 via-yellow-500 to-blue-500'; 
            break;
        case 'Argentina': 
            flagEmoji = '⚽'; 
            backgroundColor = 'bg-gradient-to-r from-blue-500 via-white to-blue-400'; 
            break;
        default: 
            flagEmoji = '🌍'; 
            backgroundColor = 'bg-gradient-to-r from-gray-400 to-gray-600'; 
            break;
    }

    originText = `${flagEmoji} ${originText}`;

    // ใช้สีพื้นหลังที่ปรับปรุงใหม่
    card.className = `p-6 rounded-lg shadow-lg transition-transform duration-300 ${backgroundColor}`;
    card.style.opacity = 0;
    card.style.transform = 'translateY(30px)';
    card.innerHTML = `
        <h2 class="text-3xl font-bold mb-4 font-serif text-center">${breedName}</h2>
        <div class="aspect-[4/3] relative overflow-hidden rounded-md mb-6">
            <img src="${cat.url}" alt="${breedName}" class="object-cover w-full h-full rounded-md shadow-lg transition-transform hover:scale-110 duration-300">
        </div>
        <div class="p-6 rounded-md shadow bg-white bg-opacity-50">
            <p class="text-lg font-light mb-2">
                <span class="font-semibold">Origin:</span> ${originText}
            </p>
            <p class="text-lg font-light mb-2">
                <span class="font-semibold">Temperament:</span>
            </p>
            <div class="flex flex-wrap gap-2 mb-4">
                ${temperament.map(temp => `<span class="bg-blue-100 bg-opacity-75 text-blue-700 px-4 py-2 rounded-full text-base">${temp}</span>`).join('')}
            </div>
            <p class="text-lg font-light">
                <span class="font-semibold">Description:</span> ${description}
            </p>
        </div>
    `;

    // เพิ่ม Hover Effect
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.05)';
        card.style.boxShadow = '0px 10px 20px rgba(0, 0, 0, 0.2)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';
        card.style.boxShadow = '0px 5px 10px rgba(0, 0, 0, 0.1)';
    });

    card.addEventListener('click', () => showCatModal(cat));

    return card;
}


function showLoadMoreButton() {
    let loadMoreButton = document.getElementById('loadMore');

    if (!loadMoreButton) {
        loadMoreButton = document.createElement('button');
        loadMoreButton.id = 'loadMore';
        loadMoreButton.className = 'mt-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-110 hover:bg-blue-700 transition-transform duration-300';
        loadMoreButton.textContent = 'Load More Cats';
        loadMoreButton.addEventListener('click', fetchCats);
        document.querySelector('.container').appendChild(loadMoreButton);
    }
}

// ✅ ฟังก์ชันโหลดฟอนต์จาก Google Fonts
function loadFonts() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap';
    
    document.head.appendChild(link);

    document.body.style.fontFamily = "'Libre Baskerville', serif";
}


