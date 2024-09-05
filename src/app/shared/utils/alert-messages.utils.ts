import Swal from 'sweetalert2';

export const successAlert = (message: string): void => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    text: message,
    timerProgressBar: true,
    icon: 'success'
  });
}

export const infoAlert = (message: string): void => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    text: message,
    timerProgressBar: true,
    icon: 'info'
  });
}

export const warningAlert = (message: string): void => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    text: message,
    timerProgressBar: true,
    icon: 'warning'
  });
}

export const errorAlert = (message: string): void => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    text: message,
    timerProgressBar: true,
    icon: 'error'
  });
}
