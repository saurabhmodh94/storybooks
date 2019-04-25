const moment = require('moment');

module.exports = {
  truncate: function(str, len) {
    if (str.length > len && str.length > 0) {
      var new_str = str + ' ';
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(' '));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + '...';
    }
    return str;
  }, // TODO: understand
  stripTags: function(input) {
    return input.replace(/<(?:.|\n)*?>/gm, '');
  }, // TODO: understand
  formatDate: function(date, format) {
    return moment(date).format(format); // tip
  },
  select: function(selected, options) {
    return options
      .fn(this)
      .replace(new RegExp('selected'), '') // tip: improved sol. from course
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp('>' + selected + '</option>'),
        ' selected="selected"$&'
      );
  },
  editIcon: function(storyUser, loggedUser, storyId, floating = true) {
    return storyUser == loggedUser
      ? `<a href="/stories/edit/${storyId}" class="${
          floating ? 'btn-floating halfway-fab red' : ''
        }"><i class="fa fa-pencil"></i></a>`
      : '';
  }
};
