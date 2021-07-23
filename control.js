


function showPage(clickedId) {

    const controller = {
        "aboutButton": "#aboutPage",
        "mainButton": "#mainPage",
        "funButton": "#funPage"};


    for (let i = 0; i < 3; i++){
        var btn = Object.keys(controller)[i];
        document.querySelector(controller[btn]).style.zIndex = 1 ;
    };

    document.querySelector(controller[clickedId]).style.zIndex = 3;
};




















