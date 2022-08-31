const criptomonedasSelect =  document.querySelector('#criptomonedas');
const monedaSelect =  document.querySelector('#moneda');
const formulario =  document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
//Creacion del promise

const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas); 
});

//Creacion del objeto
const objBusqueda = {
    moneda : '',
    criptomoneda : ''
}

document.addEventListener('DOMContentLoaded', ()=> {
    consultarCriptomoneda();
    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);

    formulario.addEventListener('submit', validarFormulario);
});

function validarFormulario(e){
    e.preventDefault();

    const { moneda, criptomoneda} = objBusqueda;

    if(moneda ==='' || criptomoneda === ''){
        mostrarMensaje('Ambos campos son obligatorios');
        return;
    }

    consultarAPI();
}

function consultarAPI(){
    const { moneda, criptomoneda} = objBusqueda;

    const url=  `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinnner();
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => {
            cotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        })
}

function mostrarSpinnner(){
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML =`
    <div class="spinner">
  <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>
</div>
    `;

    resultado.appendChild(spinner);

}

function cotizacionHTML(cotizacion){
    const {PRICE , HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} =cotizacion;

    limpiarHTML();
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML =`El precio es <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML =`El precio mas alto del dia es <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML =`El precio mas bajo del dia es <span>${LOWDAY}</span>`;

    const cambio = document.createElement('p');
    cambio.innerHTML =`Variacion de las ultimas 24 horas: <span>${CHANGEPCT24HOUR}</span>`;

 
    const actualizacion = document.createElement('p');
    actualizacion.innerHTML =`Ultima Actualización: <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(cambio);
    resultado.appendChild(actualizacion);
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarMensaje(mensaje){
    
    if(!document.querySelector('.error')){
        const mensajeDiv = document.createElement('div');
        mensajeDiv.textContent = mensaje;
        mensajeDiv.classList.add('error');
        formulario.appendChild(mensajeDiv);

        setTimeout(() => {
            mensajeDiv.remove();
        }, 3000);
    }
    
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
    
}


function consultarCriptomoneda(){
    const url='https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas));
}

function selectCriptomonedas(criptomonedas){

    criptomonedas.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
    
    
}