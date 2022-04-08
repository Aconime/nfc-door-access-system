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