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


// ✅ **เพิ่มฟังก์ชัน renderCats()**
function renderCats() {
    const grid = document.getElementById('catGrid');
    grid.innerHTML = '';

    cats.forEach((cat) => {
        const card = createCatCard(cat);
        grid.appendChild(card);

        // ✅ เพิ่มแอนิเมชันให้การ์ดแสดงผลอย่างนุ่มนวล
        card.style.opacity = 0;
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.opacity = 1;
            card.style.transform = 'translateY(0)';
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        }, 100);
    });

    showLoadMoreButton();
}
// ✅ ฟังก์ชันเลือกสีข้อความให้ตรงข้ามพื้นหลัง
function getContrastTextColor(bgColor) {
    // ✅ กรณีพื้นหลังเป็นสีขาว -> ข้อความเป็นสีดำ
    if (bgColor.includes("from-white") || bgColor.includes("to-white")) {
        return "text-black";
    }

    // ✅ รายการสีพื้นหลังที่สว่าง -> ให้ข้อความเป็นสีดำ
    const lightColors = [
        "from-yellow-400", "from-yellow-500", "from-yellow-600", 
        "from-green-300", "from-gray-300", "from-blue-300", "from-pink-300"
    ];
    
    return lightColors.some(color => bgColor.includes(color)) ? "text-black" : "text-white";
}

// ✅ ฟังก์ชันสร้างการ์ดแมว
function createCatCard(cat) {
    const card = document.createElement('div');

    const breedName = cat.breeds?.[0]?.name || 'Unknown Breed';
    let originText = cat.breeds?.[0]?.origin || 'Unknown Origin';
    const temperament = cat.breeds?.[0]?.temperament || 'Information not available';
    const description = cat.breeds?.[0]?.description || 'No description available';

    let backgroundColor;
    let flagEmoji = '';

    // ✅ เงื่อนไข Switch Case สำหรับพื้นหลัง (ตรงกับสีธงชาติ)
    switch (originText) {
        case 'Canada': flagEmoji = '🍁'; backgroundColor = 'from-red-500 to-white'; break;
        case 'United States': flagEmoji = '🗽'; backgroundColor = 'from-blue-700 to-red-600'; break;
        case 'United Kingdom': flagEmoji = '👑'; backgroundColor = 'from-blue-600 to-red-500'; break;
        case 'Japan': flagEmoji = '🎌'; backgroundColor = 'from-white to-red-500'; break;
        case 'Russia': flagEmoji = '🐻'; backgroundColor = 'from-white to-blue-500 to-red-600'; break;
        case 'Thailand': flagEmoji = '🐘'; backgroundColor = 'from-blue-600 to-white to-red-500'; break;
        case 'France': flagEmoji = '🥖'; backgroundColor = 'from-blue-500 to-white to-red-500'; break;
        case 'Germany': flagEmoji = '🍺'; backgroundColor = 'from-black to-red-600 to-yellow-500'; break;
        case 'South Korea': flagEmoji = '🎎'; backgroundColor = 'from-white to-red-500'; break;
        case 'Italy': flagEmoji = '🍕'; backgroundColor = 'from-green-500 to-white to-red-500'; break;
        case 'Spain': flagEmoji = '🎭'; backgroundColor = 'from-red-600 to-yellow-500'; break;
        case 'China': flagEmoji = '🐉'; backgroundColor = 'from-red-500 to-yellow-500'; break;
        case 'Brazil': flagEmoji = '🌴'; backgroundColor = 'from-green-500 to-yellow-500'; break;
        case 'Argentina': flagEmoji = '⚽'; backgroundColor = 'from-blue-400 to-white'; break;
        case 'Mexico': flagEmoji = '🌮'; backgroundColor = 'from-green-500 to-white to-red-500'; break;
        case 'Egypt': flagEmoji = '🕌'; backgroundColor = 'from-red-500 to-white to-black'; break;
        case 'South Africa': flagEmoji = '🦁'; backgroundColor = 'from-red-500 to-blue-600 to-green-500'; break;
        default: flagEmoji = '🌍'; backgroundColor = 'from-gray-400 to-gray-600'; break;
    }

    originText = `${flagEmoji} ${originText}`;

    // ✅ ใช้ฟังก์ชัน getContrastTextColor() เพื่อกำหนดสีข้อความ
    const textColor = getContrastTextColor(backgroundColor);

    card.className = `p-6 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl hover:bg-opacity-90 transition-transform duration-300 bg-gradient-to-r ${backgroundColor}`;

    // ✅ อัปเดต UI ให้สีข้อความตรงข้ามกับพื้นหลัง
    card.innerHTML = `
        <h2 class="text-2xl font-bold mb-4 font-serif text-center ${textColor}">${breedName}</h2>
        <div class="aspect-[4/3] relative overflow-hidden rounded-md mb-6">
            <img src="${cat.url}" alt="${breedName}" class="object-cover w-full h-full rounded-md shadow-lg transition-transform hover:scale-110 duration-300">
        </div>
        <div class="space-y-2">
            <p class="text-lg font-semibold ${textColor}">
                Origin: <span class="${textColor}">${originText}</span>
            </p>
            <p class="text-lg font-semibold ${textColor}">
                Temperament: <span class="${textColor}">${temperament}</span>
            </p>
            <p class="text-lg font-semibold ${textColor}">
                Description: <span class="${textColor}">${description}</span>
            </p>
        </div>
    `;

    card.addEventListener('click', () => showCatModal(cat));

    return card;
}




function showLoadMoreButton() {
    let loadMoreButton = document.getElementById('loadMore');

    if (!loadMoreButton) {
        loadMoreButton = document.createElement('button');
        loadMoreButton.id = 'loadMore';
        loadMoreButton.className = 'mt-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-110 transition-transform duration-300';
        loadMoreButton.textContent = 'Load More Cats';
        loadMoreButton.addEventListener('click', fetchCats);
        document.querySelector('.container').appendChild(loadMoreButton);
    }
}


// ✅ ฟังก์ชันแสดง Modal Popup
function showCatModal(cat) {
    const modal = document.getElementById('catModal');
    const modalContent = document.getElementById('modalContent');

    modalContent.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
            <h2 class="text-3xl font-bold mb-4 text-center text-gray-900">${cat.breeds?.[0]?.name || 'Unknown Breed'}</h2>
            
            <!-- ✅ ปรับภาพเป็นสัดส่วน 4:3 -->
            <div class="relative w-full aspect-[4/3] overflow-hidden rounded-lg shadow-md">
                <img src="${cat.url}" 
                     alt="Cat Image" 
                     class="object-cover w-full h-full hover:scale-105 transition duration-300">
            </div>

            <p class="text-lg text-gray-700 font-medium mt-4">
                <span class="font-semibold">Origin:</span> ${cat.breeds?.[0]?.origin || 'Unknown'}
            </p>
            <p class="mt-2 text-base text-gray-700">
                <span class="font-semibold">Temperament:</span> ${cat.breeds?.[0]?.temperament || 'Information not available'}
            </p>
            <p class="mt-2 text-base text-gray-700">
                <span class="font-semibold">Description:</span> ${cat.breeds?.[0]?.description || 'No description available'}
            </p>
            
            <button onclick="closeModal()" 
                class="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 transition transform hover:scale-105 duration-300">
                Close
            </button>
        </div>
    `;

    modal.classList.remove('hidden');
}

// ✅ ฟังก์ชันปิด Modal
function closeModal() {
    document.getElementById('catModal').classList.add('hidden');
}

// ✅ ฟังก์ชันสร้าง Modal
function createModal() {
    const modal = document.createElement('div');
    modal.id = 'catModal';
    modal.className = 'hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center';
    modal.innerHTML = `<div id="modalContent"></div>`;
    document.body.appendChild(modal);
}


// ✅ ฟังก์ชันโหลดฟอนต์จาก Google Fonts
function loadFonts() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap';
    
    document.head.appendChild(link);

    document.body.style.fontFamily = "'Libre Baskerville', serif";
}


