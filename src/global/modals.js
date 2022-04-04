function showInnerModal(title, message, buttonText="OK", buttonCallback=() => {}) {
  const modalTitle = document.getElementById("inner-modal-title");
  const modalMessage = document.getElementById("inner-modal-message");
  const modalButton = document.getElementById("inner-modal-button");

  modalTitle.innerText = title;
  modalMessage.innerText = message;
  modalButton.innerText = buttonText;

  $("#inner-modal").modal({ allowMultiple: true, closable: false, onDeny: () => buttonCallback() }).modal('show');
}

function showInnerQuestionModal(title, message, yesClickedCallback=() => {}, finalCallback=() => {}) {
  const modalTitle = document.getElementById("inner-question-modal-title");
  const modalMessage = document.getElementById("inner-question-modal-message");

  modalTitle.innerText = title;
  modalMessage.innerText = message;

  $("#inner-question-modal").modal({ allowMultiple: true, closable: false, onApprove: () => yesClickedCallback(), onHidden: () => finalCallback()}).modal('show');
}

export { showInnerModal, showInnerQuestionModal };