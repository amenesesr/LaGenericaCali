//const modalCliente = new bootstrap.Modal(document.getElementById('modalCliente'))

var modalCliente = document.getElementById('modalCliente')

modalCliente.addEventListener('shown.bs.modal', function () {
    myInput.focus()
})

const onClientes = (element, event, selector, handler) =>{
    element.addEventListener(event, e => {
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}

onClientes(document, 'click', '.btnEditarCliente', eCliente =>{
    const fila = eCliente.target.parentNode.parentNode
    txtCedula_editar.value = fila.children[0].innerHTML
    txtNombre_editar.value = fila.children[1].innerHTML
    txtTelefono_editar.value = fila.children[2].innerHTML
    txtCorreo_editar.value = fila.children[3].innerHTML
    txtDireccion_editar.value = fila.children[4].innerHTML
    modalCliente.show()
})

function confirmarCliente(cedula_clientes){
    Swal.fire({
    title: '¿Desea eliminar el Cliente '+ cedula_clientes +'?',
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
            title: 'Cliente borrado con exito',
            showConfirmButton: false,
            timer: 15000
        })
        window.location='/cali/clientes/eliminar/'+cedula_clientes
    }
  })
}

