$('#app-sidemenu .item').tab();
$('.ui-dropdown').dropdown({ clearable: true });
$('*').popup();

// FILTER MENU
$('#dashboard-filter > .item').on('click', function() {   
  $(this)
    .addClass('active')
    .siblings()
    .removeClass('active'); 
});

// OPEN NEW DOOR MODAL
$('#add-door-modal').modal({
  onShow: () => {
    
  }
}).modal('attach events', '#open-new-door-modal', 'show');
