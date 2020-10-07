$(function() {
  let template = null
  getUsers()
  getCities()


//Валидация для формы при добавлении человека
    $("form").validate({
        ignore: ":hidden",
        rules: {
            name: {
                required: true,
                maxlength: 30,
                regexp: '^([a-zA-Zа-яА-Я]+)$'
            },
            age: {
                required: true,
                digits: true,
                range: [0, 112]
            }

        },
        messages: {
            name: {
                required: "Заполните поле!",
                maxlength: "Имя должно быть меньше 30-ти символов",
                regexp: 'Имя должно состоять только из букв'
            },
            age: {
                required: "Поле обязательно для заполнения",
                digits: "В поле должны быть только положительные числа",
                range: "Как вы еще живы ?"
            }
        },
        submitHandler: function (form) {
            $.ajax({
                type: "POST",
                url: "add-users.php",
                data: $(form).serialize(),
                success: function(data){
                    $('#user-form').trigger('reset')
                    $('.modal').modal('hide')
                    getUsers()
                }
            });
        }
    })

    jQuery.validator.addMethod(
        'regexp',
        function(value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "Please check your input."
    );

  // Добавление и вывод человека
  function getUsers() {
    $.ajax({
      url: 'users-list.php',
      type: 'GET',
      success: function(data) {
        const user = JSON.parse(data);
        let template = '';
        user.forEach(user => {
          if (user.city === null) {
            user.city = 'Город не выбран'
          }
          template += `
                    <tr data-id="${user.id}">
                      <td>${user.id}</td>
                      <td class="name" data-value="${user.name}">
                        ${user.name}
                      </td>
                      <td class="age" data-value="${user.age}">
                        ${user.age}</td>
                      <td class="city city_id">
                        ${user.city}</td>
                        
                      <td style="border: hidden">
                        <button class="user-delete btn btn-outline-danger text-dark">
                             Удалить
                        </button>
                      </td>
                    </tr> `
        });
        $('#user').html(template);
      }
    });
  }

//Добавление города и валидация
  function getCities() {
    $.ajax({
      url: 'cities-list.php',
      type: 'GET',
      success: function(data) {
        const city = JSON.parse(data);
        template = `<option value="">Город не выбран</option>`+ '<option value="" disabled="disabled">――――――――――――――――――――</option>'
        city.forEach(city => {
          template += `<option value="${city.id}">${city.name}</option>`
        });
        $('select').html(template);
      }
    });
  }

    //Создание инпута для редактирования имени
  $(document).on('click', 'td.name', function () {

    if ($("#editboxname").length > 0) {
      return false;
    }

    let tdClasses = $(this).attr('class').split(" ");
    let fieldName = tdClasses[0];
    let dataId = $(this).parent('tr').data('id');
    $(this).addClass('ajax').html('<input data-id="'+dataId+'" data-fieldname="'+fieldName+'" class="form-control" id="editboxname" type="text" value="' + $(this).text().replace(/\s+/g, '') +'" />');
    $('#editboxname').focus();

  });

    //Создание инпута для редактирования возраста по нажатию
    $(document).on('click', 'td.age', function () {

        if ($("#editboxage").length > 0) {
            return false;
        }

        let tdClasses = $(this).attr('class').split(" ");
        let fieldName = tdClasses[0];
        let dataId = $(this).parent('tr').data('id');
        $(this).addClass('ajax').html('<input data-id="'+dataId+'" data-fieldname="'+fieldName+'" class="form-control" id="editboxage" type="text" value="' + $(this).text().replace(/\s+/g, '') +'" />');
        $('#editboxage').focus();

    });

  //обработчик городов
  $(document).on('click', 'td.city',
      function() {
        if ($("#editboxcity").length > 0) {
          return false;
        }
        let city_name = $(this).text().replace(/\s+/g, '')
        let tdClasses = $(this).attr('class').split(" ");
        let fieldName = tdClasses[1];
        let dataId = $(this).parent('tr').data('id');
        $(this).addClass('ajax-city').html('<select data-id="'+dataId+'" data-fieldname="'+fieldName+'" class="form-control" id="editboxcity" >'+template+'</select>');
        $('#editboxcity').focus();
        $(this).find(`option:contains("${city_name}")`).prop('selected', true)
      }
  )

  //Редактирование данных после увода курсора для города
  $(document).on('mouseleave', '#editboxcity', function (e) {

    let fieldName = $(this).data('fieldname');
    let dataId = $(this).data('id');
    $.ajax({
      type: "POST",
      url:"edit-users.php",
      data: {value:$(this).val(),id:dataId,field:fieldName},
      success: function(data){
        let ajax_city = $('.ajax-city')
        let text = $('.ajax-city select').find('option:selected').text()
        if (text === null) {
          ajax_city.html('Город не выбран');
        } else {
          ajax_city.html(text);
        }
        ajax_city.removeClass('ajax-city');
      }
    });
  });

  //удаление
  $(document).on('click', '.user-delete', function(e) {
    const id = $(this).parent().parent('tr').data('id');
    $.ajax({
      url: 'del-users.php',
      type: 'POST',
      data: {id: id},
      success: function(data){
        getUsers()
      }
    })
  })


});

function edit_php (dataId, fieldName, tag) {
    $.ajax({
        type: "POST",
        url: 'edit-users.php',
        data: {update: {value: $(tag).val() ,id: dataId, field: fieldName}},
        success: function(data){
            let ajax = $('.ajax')
            ajax.data('value', $('.ajax input').val())
            ajax.html($('.ajax input').val());
            ajax.removeClass('ajax');
        }
    })
}

function send_name(tag){
    let fieldName = $(tag).data('fieldname');
    let dataId = $(tag).data('id');
    let regex = RegExp('^([a-zA-Zа-яА-Я ]+)$')

    if ($(tag).val() !== '' && $(tag).val().length < 30 && regex.test($('.ajax input').val())){
        edit_php(dataId, fieldName, tag)
    } else {
        let ajax = $('.ajax')
        ajax.html(ajax.data('value'));
        ajax.removeClass('ajax');
    }

}

function send_age(tag){
    let dataId = $(tag).data('id');
    let fieldName = $(tag).data('fieldname');
    let regex = RegExp('^([0-9]+)$')
    if ($(tag).val() !== '' && Number.parseInt($(tag).val()) < 100 && regex.test($('.ajax input').val())){
        edit_php(dataId, fieldName, tag)
    } else {
        let ajax = $('.ajax')
        ajax.html(ajax.data('value'))
        ajax.removeClass('ajax')
    }
}
$(document).on('mouseleave', '#editboxname', function (e) {
    send_name(this)
})

$(document).on('keydown', '#editboxname', function (e) {

    if (e.keyCode == 13) {
        send_name(this)
    }

});

$(document).on('mouseleave', '#editboxage', function (e) {
    send_age(this)
})

$(document).on('keydown', '#editboxage', function (e) {
    if (e.keyCode == 13) {
        send_age(this)
    }

});