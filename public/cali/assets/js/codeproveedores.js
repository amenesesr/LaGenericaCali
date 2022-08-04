//const modalProveedor = new bootstrap.Modal(document.getElementById('modalProveedor'))
var modalProveedor = document.getElementById('modalProveedor')

modalProveedor.addEventListener('shown.bs.modal', function () {
    myInput.focus()
})

const onProveedor = (element, event, selector, handler) =>{
    element.addEventListener(event, e => {
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}

onProveedor(document, 'click', '.btnEditarProveedor', eProveedor =>{
    const fila = eProveedor.target.parentNode.parentNode
    txtNIT_editar.value = fila.children[0].innerHTML
    txtNombre_editar.value = fila.children[1].innerHTML
    txtCiudad_editar.value = fila.children[2].innerHTML
    txtDireccion_editar.value = fila.children[3].innerHTML
    txtTelefono_editar.value = fila.children[4].innerHTML
    modalProveedor.show()
})

function confirmarProveedor(nit_proveedores){
    Swal.fire({
    title: '¿Desea eliminar el proveedor '+ nit_proveedores +'?',
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
            title: 'proveedor borrado con exito',
            showConfirmButton: false,
            timer: 15000
        })
        window.location='/cali/proveedores/eliminar/'+ nit_proveedores
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
        //PRevio del PDF
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