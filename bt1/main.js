//co ban
// var a = 10;
// var b = "10";
// console.log(a);
// console.log(b);
// const XIN_CHAO = "Em chao anh Long";
//
// function Tong(a, b) {
//     return a + b;
// }
// console.log(Tong(4, 5));
//
// var Tong = (a, b) => {
//     return a + b;
// }
// console.log(Tong(5, 5));
//
// var Tong = (a, b) => a + b;
// console.log(Tong(5, 5));
//lam viec voiw mang
let array = [1, 2, 3, 4, 5, 6, 7, 8];
// array[3] = 10;
// array[10] = 11;
// array[11] = "Miyato";
// array[12] = "dep trai";
// for (const element of array) {
//     console.log(element);
// }
//
// console.log(array);
// let result = [];  // Khai báo biến result
// for (const element of array) {
//     if (typeof element != "number") {
//         array2[index] = "Nax";
//     } else {
//         if (element % 2 === 0) {
//             result.push('chẵn');
//         } else {
//             result.push('lẻ');
//         }
// }
// }
//
// let array2 = array.map(function (e) {
//     if (typeof e != "number") {
//         return "NaN";
//     } else {
//         if (e % 2 === 0) {
//             return "chẳn";
//         } else {
//             return "lẻ";
//         }
//     }
// })
// console.log(array2);
//bat dong bo
let a;
setTimeout(function () {

    console.log("Em chao anh lan 1"); // In ra 10 sau 2 giây
    setTimeout(function () {
        console.log("chao em lan 1")
        setTimeout(function () {
            console.log("Em chao anh lan 2");
        }, 500)
    }, 500)
}, 500);

