const socket = io();

//Create product and add new product in the table
let formProducts = document.getElementById("form-products")
let title = document.getElementById("form-new-product-title")
let description = document.getElementById("form-new-product-description")
let price = document.getElementById("form-new-product-price")
let thumbnails = document.getElementById("form-new-product-thumbnails")
let code = document.getElementById("form-new-product-code")
let stock = document.getElementById("form-new-product-stock")
let category = document.getElementById("form-new-product-category")
let status = document.getElementById("form-new-product-status")

formProducts.addEventListener("submit", (e) => {
  e.preventDefault();
  // Evita el comportamiento predeterminado de envío del formulario, que provocaría la recarga de la página

  let newProduct = {
    title: title.value,
    description: description.value,
    price: price.value,
    thumbnails: [thumbnails.value],
    code: code.value,
    stock: stock.value,
    category: category.value,
    status: status.checked
  };
  // Crea un nuevo objeto llamado "newProduct" y asigna los valores de los campos del formulario a sus propiedades

  socket.emit("new-product-created", newProduct);
  // Emite un evento "new-product-created" utilizando un socket (presumiblemente un WebSocket) y envía el objeto newProduct como datos
});

socket.on("repeat-code", (bool)=>{
  if(bool){
    Swal.fire({
      title: 'duplicate code',
      text: "Please change the code",
      icon: 'warning',
    });
  }
})

socket.on("products", (products) => {
    let lastProduct = products.slice(-1).pop();
    let container = document.getElementById("dinamic-product-list");
    let data = document.createElement("tr");
    container.append(data);
    data.innerHTML = `
      <td>${lastProduct.id}</td>
      <td>${lastProduct.title}</td>
      <td>${lastProduct.description}</td>
      <td>${lastProduct.price}</td>
      <td>[${lastProduct.thumbnails}]</td>
      <td>${lastProduct.code}</td>
      <td>${lastProduct.stock}</td>
      <td>${lastProduct.category}</td>
      <td>${lastProduct.status}</td>
      <td>
        <button type="button" class="btn-delete" value=${lastProduct.id}>Eliminar
        </button>
      </td>
    `;
    btnDelete = document.querySelectorAll(".btn-delete");
    setDelete(btnDelete);
});


// Delete product and delete in table
let btnDelete = document.querySelectorAll(".btn-delete");

function setDelete(btnDelete) {
  for (let btn of btnDelete) {
    btn.addEventListener("click", () => {
      Swal.fire({
        title: 'Do you want to delete',
        text: `you are going to delete the product with the ID: "${btn.value}"`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          let idToDelete = btn.value
          socket.emit("delete-product", idToDelete)
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })
    });
  };
}

setDelete(btnDelete);

socket.on("delete-product-in-table", (idToDelete) => {
  
  btnDelete = document.querySelectorAll(".btn-delete");
  for (let btn of btnDelete) {
    if (btn.value == idToDelete) {
      let hijo = btn.parentNode;
      let padre = hijo.parentNode;
      padre.remove()
    }
  }
})