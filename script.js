'use strict';

const dataBase = JSON.parse(localStorage.getItem('awito')) || []; //хранение данных в localStorage, создать свою бд

let counter = dataBase.length; //счетчик количества обьявлений

const modalAdd = document.querySelector('.modal__add');
const addAd = document.querySelector('.add__ad');
const modalBtnSubmit = document.querySelector('.modal__btn-submit');
const modalSubmit = document.querySelector('.modal__submit');
const catalog = document.querySelector('.catalog');
const modalItem = document.querySelector('.modal__item');
const modalBtnWarning = document.querySelector('.modal__btn-warning');
const modalFileInput = document.querySelector('.modal__file-input');
const modalFileBtn = document.querySelector('.modal__file-btn');
const modalImageAdd = document.querySelector('.modal__image-add');
//====== елементы модального окна-описания
const modalImageItem = document.querySelector('.modal__image-item');
const modalHaderItem = document.querySelector('.modal__header-item');
const modalStatusItem = document.querySelector('.modal__status-item');
const modalDescriptionItem = document.querySelector('.modal__description-item');
const modalCostItem = document.querySelector('.modal__cost-item');

const searchInput = document.querySelector('.search__input');
const menuContainer = document.querySelector('.menu__container');


//====== переменные для замены текста и изображения при добавлении обьявления
const textFileBtn = modalFileBtn.textContent; //временная переменная для замены текста
const srcModalImage = modalImageAdd.src; //замена изображения




//работа с елементами форм, отфильтровать лишнее
const elementsModalSubmit = [...modalSubmit.elements]
    .filter(elem => elem.tagName !== 'BUTTON' && elem.type !== 'submit');
//console.log([...elementsModalSubmit]); получили коллекцию, теперь её нужно перевести в массив, методом spread оператор 
//elementsModalSubmit.forEach(console.dir)



//=================== работа с фото ======================
const infoPhoto = {};
//=================== работа с фото ======================



//================= сохранение в localStorage ==============
const saveDB = () => {
    localStorage.setItem('awito', JSON.stringify(dataBase)); //перевод обьекта(данных) в строку JSON.stringify потом "распарсить" в обьект, 30 строка
}

//================= сохранение в localStorage ==============



//==================работа с формами=====================
const checkForm = () => { //проверка заполнены ли елементы форм
    const validForm = elementsModalSubmit.every(elem => elem.value); //если елемент заполнен, что-то выбрано - вернет false
    modalBtnSubmit.disabled = !validForm; //когда выбранно будет все что нужно - разблокирует кнопку
    //  console.log(validForm);
    modalBtnWarning.style.display = validForm ? 'none' : '';
    /*  if (validForm) {
    modalBtnWarning.style.display = 'none'
} else {
    modalBtnWarning.style.display = ''
}
*/
};
//==================работа с формами=====================




//=====================================закрытие модальных окон ===============
//this - обьект, который вызывает событие, лямбда функция к нему не применима, только старый стандарт
const closeModal = (event) => {
    //  console.log(event.target); - проверка места клика
    const target = event.target;
    if (target.closest('.modal__close') || //место клика - ближайший к нужному на случай промаха
        target.classList.contains('modal') ||
        event.code === 'Escape') { //нажатие на Escape новым методом
        modalAdd.classList.add('hide'); //добавить класс hide, что бы закрыть
        modalItem.classList.add('hide');
        document.removeEventListener('keydown', closeModal); //document.removeEventListener('keyup', closeModalEscape); создали отбельно событие закрытия по Esc, потом добавить его в ф-ции модальных окон
        modalSubmit.reset(); //очистка формы
        modalImageAdd.src = srcModalImage; //замена изображения
        modalFileBtn.textContent = textFileBtn; //замена текста
        checkForm();
    }
};
//=====================================закрытие модальных окон ===============




//============== добавление подаваемых обьявлений ==========
const renderCard = (DB = dataBase) => { //присвоить DB = dataBase
    catalog.textContent = '';
    DB.forEach((item) => { //!!!!!!!!!!!!!!
        catalog.insertAdjacentHTML('beforeend', `      
                <li class="card" data-id="${item.id}">
                    <img class="card__image" src="data:image/jpeg;base64,${item.image}" alt="test">
                    <div class="card__description">
                        <h3 class="card__header">${item.nameItem}</h3>
                        <div class="card__price">${item.costItem} ₽</div>
                    </div>
                </li>   
        `);
    });
};
//============== добавление подаваемых обьявлений =========================


//====================поиск по заголовкам внутри сайта===========================
searchInput.addEventListener('input', (event) => {
    // console.log(searchInput.value.trim().toLowerCase()); - игнор пробелов и перевод в нижний регистр
    // метод trim() позволяет игнорировать пробелы спереди и сзади
    const valueSearch = searchInput.value.trim().toLowerCase(); //игнор пробелов и перевод в нижний регистр
    if (valueSearch.length > 2) {
        //   console.log(valueSearch); //выведет если в поиске вбито больше 2 символов
        const result = dataBase.filter(item => item.nameItem.toLowerCase().includes(valueSearch) ||
            item.descriptionItem.toLowerCase().includes(valueSearch));
        //  console.log(result);
        renderCard(result);
    }
});



//============================событие для добавления картинки=====================
modalFileInput.addEventListener('change', (event) => {
    const target = event.target;

    const reader = new FileReader(); // !!!!!!!!!!!!!!!!!!!!!

    const file = target.files[0];

    infoPhoto.filename = file.name;
    infoPhoto.size = file.size;

    reader.readAsBinaryString(file);

    reader.addEventListener('load', (event) => {
        if (infoPhoto.size < 200000) {
            modalFileBtn.textContent = infoPhoto.filename; //замена "добавить фото" на имя добавленного файла
            infoPhoto.base64 = btoa(event.target.result); // !!!!!!!!!!!!!!!!!!!!!!!! конвертирует картинку в строку  
            modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`; //вывоб строки-картинки в виде картинки, а не строки
        } else {
            modalFileBtn.textContent = 'размер файла слишком большой';
            modalFileInput.value = '';
            checkForm();
        }
    });
});
//============================событие для добавления картинки=====================



//====================работа с методом 'every' для проверки заполнения внесенных данных===============
modalSubmit.addEventListener('input', checkForm);

modalSubmit.addEventListener('submit', event => { //запрет перезагрузки страницы после клика "отправить"
    event.preventDefault();
    const itemObj = {}; //создали обьект пустой
    for (const elem of elementsModalSubmit) { //перенос в обьект параметров и оперрируем ими
        itemObj[elem.name] = elem.value;
        //  console.log(elem.name);
        // console.log(elem.value);
    }
    itemObj.id = counter++;
    itemObj.image = infoPhoto.base64;
    dataBase.push(itemObj);
    //  console.log(dataBase);
    closeModal({ target: modalAdd }); //замена event с помощью пустого оьекта и добавления к нему свойств
    saveDB(); //для хранения данных в локал сторадж
    renderCard();
});


//========================показ модального окна карточки=================================
addAd.addEventListener('click', () => { //отслеживание клика по модальному окну
    modalAdd.classList.remove('hide'); //если клик на modalAdd - убрать класс hide, что покажет спрятанное окно
    modalBtnSubmit.disabled = true;
    document.addEventListener('keydown', closeModal);
});


//=================работа с карточками, открытие модалки при клике==========================
catalog.addEventListener('click', (event) => {
    const target = event.target;
    const card = target.closest('.card');
    //  console.dir(card); //вывод елемента со всеми его атрибутами
    if (card) {
        //======================замена информации в модальном окне====================
        // console.log(card.dataset.idItem); //узнать порядок карточки в массиве базы, прописывать idItem вместо id-item
        // console.log(dataBase);
        // console.log(dataBase[card.dataset.idItem]); //получение самого обьекта карточки
        const item = dataBase.find(obj => obj.id === +card.dataset.id); // "+" привести к одному типу данных
        // parseInt(card.dataset.id) еще 1 способ привести данные к одному типу
        // console.log(typeof obj.id);
        // console.log(typeof card.dataset.id);
        modalImageItem.src = `data:image/jpeg;base64,${item.image}`; //замена картинки
        modalHaderItem.textContent = item.nameItem; //название
        modalStatusItem.textContent = item.status === 'new' ? 'Новый' : 'Б/У'; //состояние
        modalDescriptionItem.textContent = item.descriptionItem; //описание
        modalCostItem.textContent = item.costItem; //цена

        modalItem.classList.remove('hide'); //закрытие окна
        //Keycode устаревшее, не использовать
        document.addEventListener('keydown', closeModal)
    };
});

//================переход по категориям товаров===========================
menuContainer.addEventListener('click', (event) => {
    const target = event.target;
    //обработка по тегу
    if (target.tagName === 'A') { //фильтр результатов клика
        const result = dataBase.filter(item => item.category === target.dataset.category);
        renderCard(result);
    }
});



modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);


renderCard();


//1.22.04

/*
новые типы данных
let symbol = Symbol('');
let bigInt = bigInt;
*/

/*
let multiStr = 'Привет\n' +
    'МИР\n' +
    '!';

let arrStr = [
    'Привет',
    'Мир',
    '!',
].join('\n')

const name = 'GAGA'

let templStr = `
Привет
${name}
!
`;
console.log(templStr);
*/