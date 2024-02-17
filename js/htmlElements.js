export function rendertotalResults(total){
    let element = document.getElementById('total-results')
    element.textContent = `Foram inseridos ${total} valores formatados na folha Sheet2`
}

export function rendertotalPoints(points){
    let element = document.getElementById('total-points')
    element.textContent = `Foram tocados ${points} pontos nessa semana`
}