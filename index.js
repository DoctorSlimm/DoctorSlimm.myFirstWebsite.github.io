function fileListToURL(fileList) {
    let file = null;
    for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].type.match(/^image\//)) {
            file = fileList[i];
            break;
        }
    }
    if (file !== null) {
        return URL.createObjectURL(file);
    }
}

function highlightActionBtn () {
    const actionBtn = document.getElementById('submit-btn');
    actionBtn.style.color = "#006400";
}

function addPictureToDOM (target) {
    const fileList = target.files;
    const imgURL = fileListToURL(fileList);
    const imagePlaceholder = document.getElementById('imagePlaceholder');
    imagePlaceholder.innerHTML = `<img src="${imgURL}" class="u-max-full-width" id="img"></img>`;
    display.innerHTML = "";
}


async function run () {
    const img = document.getElementById('img');
    const model = await mobilenet.load();
    const pred = await model.classify(img); // mobileNet needs a HTML image element to work

    // logits
    const logits = model.infer(img); // what are the logits of the image?
    console.log('Logits');
    logits.print(true);

    // image embedding
    const embedding = model.infer(img, true);
    console.log('Embeddings');
    embedding.print(true);

    // prediction results
    const results = [];
    for (let i = 0; i < pred.length; i++) {
        const entry = {
            'className': pred[i]['className'],
            'probability': pred[i]['probability'],
        };
        results.push(entry);
    }
    return results;
}





const inputImageElement = document.getElementById ('file-input');
inputImageElement.addEventListener ('change', element => {
    highlightActionBtn();
    addPictureToDOM(element.target);
});

const display = document.getElementById('prediction-list');

const actionBtn = document.getElementById ('submit-btn');

actionBtn.addEventListener ('click', () => {
    run()
    .then(results => {
        //1. sort results by prediction confidence
        const sortedResults = results.sort(function(first, second) {
            return second.price - first.price;
        });
        for (let i = 0; i < sortedResults.length; i++) {
            const res = sortedResults[i];
            const className = res['className'];
            const probability = res['probability'];
            display.innerHTML += `<li>${className}<ul><li>${probability.toFixed(3)}</li></ul></li>`;
        }
    })
});