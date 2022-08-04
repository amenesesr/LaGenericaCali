//const modalProducto = new bootstrap.Modal(document.getElementById('modalProducto'))
var modalProducto = document.getElementById('modalProducto')

modalProducto.addEventListener('shown.bs.modal', function () {
    myInput.focus()
})

const onProducto = (element, event, selector, handler) =>{
    element.addEventListener(event, e => {
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}

onProducto(document, 'click', '.btnEditarProducto', eProducto =>{
    const fila = eProducto.target.parentNode.parentNode
    txtCodigo_editar.value = fila.children[0].innerHTML
    txtNombre_editar.value = fila.children[1].innerHTML
    txtNIT_editar.value = fila.children[2].innerHTML
    txtPrecioCompra_editar.value = fila.children[3].innerHTML
    txtIVA_editar.value = fila.children[4].innerHTML
    txtPrecioVenta_editar.value = fila.children[5].innerHTML    
    modalProducto.show()
})

function confirmarProducto(codigo_productos){
    Swal.fire({
    title: '¿Desea eliminar el Producto '+ codigo_productos +' ?',
    text: "Esta accion no se puede revertir.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Confirmar'
    }).then((result) => {
    if (result.isConfirmed) {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Usuario borrado con exito',
            showConfirmButton: true,
            timer: 15000
        })
      window.location='/cali/productos/eliminar/'+ codigo_productos
    }
  })
}

function validarExt()
{
    var archivo = document.getElementById('archivo');
    var archivoRuta = archivo.value;
    var extPermitidas = /(.CSV|.csv)$/i;
    if(!extPermitidas.exec(archivoRuta)){
        alert('Asegurese de haber seleccionado archivo un .CSV');
        archivo.value = '';
        return false;
    }
    else
    {
        //Previo del PDF
        if (archivo.files && archivo.files[0]) 
        {
            var visor = new FileReader();
            visor.onload = function(e) 
            {
                document.getElementById('visorArchivo').innerHTML = 
                '<embed src="'+e.target.result+'" width="500" height="375" />';
            };
            visor.readAsDataURL(archivo.files[0]);
        }
    }
}