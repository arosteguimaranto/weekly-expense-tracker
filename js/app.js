// Variables y Selectores

const formulario = document.querySelector('#agregar-gasto');
const gastolistado = document.querySelector('#gastos ul');

// Eventos

eventListeners();
    function eventListeners(){
        document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

        formulario.addEventListener('submit', agregarGasto);


    }

// Classes

class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }


    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
}   

    calcularRestante(){
    const gastado = this.gastos.reduce((total, gasto ) => total + gasto.cantidad, 0);
    this.restante = this.presupuesto - gastado;

    console.log(this.restante);
 }
}

class UI{
 insertarPresupuesto( cantidad ) {

    // eXTRAYENDO LOS VALORES

    const { presupuesto, restante} = cantidad;

    //Agregar al HTML
    document.querySelector('#total').textContent = presupuesto;
    document.querySelector('#restante').textContent = restante;

 }
  imprimirAlerta(mensaje, tipo){
 const divMensaje = document.createElement('div');
 divMensaje.classList.add('text-center', 'alert');

 if( tipo === 'error'){
    divMensaje.classList.add('alert-danger');
 }else{
    divMensaje.classList.add('alert-success');
 }

 // Mensaje de error
 divMensaje.textContent = mensaje;
 

 // Insertar HTml
 document.querySelector('.primario').insertBefore(divMensaje, formulario); 

 // Quitar Html

setTimeout(() =>{
divMensaje.remove();
}, 3000);

  }
 
  agregarGastoListado(gastos){

        this.limpiarHTML(); // Elimina el html previsto

  //iterar sobre gastos
  gastos.forEach( gasto => {

   const { cantidad, nombre, id } = gasto;
    
    // Crear un li
    const nuevoGasto = document.createElement('Li');
    nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
   // nuevoGasto.setAttribute('data-id', id);

   nuevoGasto.dataset.id = id;
    console.log(nuevoGasto);

    // Agregar el html del gasto

    nuevoGasto.innerHTML = `${nombre}  <span class = "badge badge-primary badge-pill"> ${cantidad}</span>`



    // boton para borrar gasto
    const btnBorrar = document.createElement('button');
    btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
    btnBorrar.innerHTML = 'Borrar &times;'
    nuevoGasto.appendChild(btnBorrar)

    //Agregar al Html

    gastolistado.appendChild(nuevoGasto);
  })
  }

  // Limpiar el html
   limpiarHTML(){
    while( gastolistado.firstChild){
        gastolistado.removeChild(gastolistado.firstChild);
    }   
   }

   actualizarRestante(restante){
    document.querySelector('#restante').textContent = restante;
   }


   comprobarPresupuesto(presupuestObj){
    const {presupuesto, restante } = presupuestObj;
     
    const restanteDiv = document.querySelector('.restante');
   
    // comprobar el 25 %
    if((presupuesto / 4 ) > restante ) {
        restanteDiv.classList.remove('alert-success', 'alert-warning');
        restanteDiv.classList.add('alert-danger');
        } else if((restante / 2) > restante) {
            restanteDiv.classList.remove('alert-success');
        restanteDiv.classList.add('alert-warning');
        }

        // si el total es 0 o menor

        if(restante <= 0 ){
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');

            formulario.querySelector('button[type="submit"]').disabled = true;
        }
};
}


//instanciar

const ui = new UI();
 let presupuesto;


// Funciones
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('Cual es tu presupuesto?');

    //console.log(Number(presupuestoUsuario));

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0 ){
        window.location.reload();

    }

    // PRESUPUESTO  VALIDO
    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);


    ui.insertarPresupuesto(presupuesto);
}   

// a;ade gastos
 function agregarGasto(e){
    e.preventDefault();

    
    
    // leer lo\s datos del formulario

    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    // validar

    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');

        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no valida', 'error');

        return;
    }

    
    // Generar un objeto con el gasto

    const gasto = { nombre, cantidad, id: Date.now()}

    // a;ade nuevp gasto
    presupuesto.nuevoGasto(gasto);
    
    // mensaje de todo bien
    ui.imprimirAlerta('Gasto Agregado correctamente')

    // imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.agregarGastoListado(gastos);

    ui.actualizarRestante(restante);  
    
    ui.comprobarPresupuesto(presupuesto);

    
    //Reinicia el formulario
    formulario.reset();
}