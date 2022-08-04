function confirmar(totalfinal){
    Swal.fire({
    title: '¿Desea confirmar la venta?',
    text: 'Valor total de la venta: '+ totalfinal,
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
            title: 'Venta Registrada con exito.',
            showConfirmButton: false,
            timer: 15000
        })
        window.location='/cali/ventas'
    }
  })
}
  
  function cancelarVenta(){
      Swal.fire({
      title: '¿Esta seguro de desea cancelar la venta actual?',
      text: "Esta accion no se puede revertir.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar'
      }).then((result) => {
      if (result.isConfirmed) {
        window.location='/cali/ventasProductos/nuevaVenta'
      }
    })
  }
  
 