$(document).ready(function() {
  $('#tablaClientesR').DataTable({
      "language": {
        "decimal": ",",
        "thousands": ".",
        "lengthMenu": "Muestra _MENU_ registros por pagina",
        "zeroRecords": "No hay registros en la tabla",
        "info": "Mostrando Pagina _PAGE_ de _PAGES_",
        "infoEmpty": "No hay registros en la tabla",
        "infoFiltered": "(Filtrado de _MAX_ registros totales)",
        "search": "Buscar: ",
        "paginate": {
        "next": "Siguiente Pagina",
        "previous": "Pagina Anterior"
      }
    }
  });
});

$(document).ready(function() {
  $('#tablaVentasR').DataTable({
      "language": {
      "decimal": ",",
      "thousands": ".",
      "lengthMenu": "Muestra _MENU_ registros por pagina",
      "zeroRecords": "No hay registros en la tabla",
      "info": "Mostrando Pagina _PAGE_ de _PAGES_",
      "infoEmpty": "No hay registros en la tabla",
      "infoFiltered": "(Filtrado de _MAX_ registros totales)",
      "search": "Buscar: ",
      "paginate": {
      "next": "Siguiente Pagina",
      "previous": "Pagina Anterior"
     }
    }
  });
});

function muestra_ocultaclientes(id1, id2){
  if (document.getElementById){ //se obtiene el id
    var el1 = document.getElementById(id1); //se define la variable "el" igual a nuestro div
    var el2 = document.getElementById(id2); //se define la variable "el" igual a nuestro div
    el1.style.display = (el1.style.display == 'block') ? 'none' : 'block'; //damos un atributo display:none que oculta el div
    el2.style.display = (el2.style.display == 'block') ? 'none' : 'none'; //damos un atributo display:none que oculta el div
  }
}

function muestra_ocultaventas(id1, id2){
  if (document.getElementById){ //se obtiene el id
    var el1 = document.getElementById(id1); //se define la variable "el" igual a nuestro div
    var el2 = document.getElementById(id2); //se define la variable "el" igual a nuestro div
    el1.style.display = (el1.style.display == 'block') ? 'none' : 'block'; //damos un atributo display:none que oculta el div
    el2.style.display = (el2.style.display == 'block') ? 'none' : 'none'; //damos un atributo display:none que oculta el div
  }
}

function ocultabug(id1, id2) {
  if (document.getElementById){ //se obtiene el id
    var el1 = document.getElementById(id1); //se define la variable "el" igual a nuestro div
    var el2 = document.getElementById(id2); //se define la variable "el" igual a nuestro div
    el1.style.display = (el1.style.display == 'block') ? 'none' : 'none'; //damos un atributo display:none que oculta el div
    el2.style.display = (el2.style.display == 'block') ? 'none' : 'none'; //damos un atributo display:none que oculta el div
  }
}

window.onload = function(){/*hace que se cargue la función lo que predetermina que div estará oculto hasta llamar a la función nuevamente*/
  ocultabug('ventas', 'clientes')
  muestra_ocultaclientes('clientes', 'ventas');
  muestra_ocultaventas('ventas', 'clientes');/* "contenido_a_mostrar" es el nombre que le dimos al DIV */
 
}