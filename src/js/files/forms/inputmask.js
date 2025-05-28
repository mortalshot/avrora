/* Маски для полей (в работе)*/
// Подключение функционала "Чертоги Фрилансера"
// Подключение списка активных модулей
import { flsModules } from "../modules.js";

// Подключение модуля
import "inputmask/dist/inputmask.min.js";

const inputMasks = document.querySelectorAll('.input_phone');
if (inputMasks.length) {
	flsModules.inputmask = Inputmask("+7 (999) 999 99-99", { showMaskOnHover: false }).mask(inputMasks);
}