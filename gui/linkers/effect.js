Pts.namespace(window);

var draw = function () {
  var space = new CanvasSpace("#canvas");
  space.setup({
    bgcolor: "#252934"
  });

  var form = space.getForm();

  var pts = new Group();
  var center;
  const count = 200;

  space.add({
    start: function () {

      center = new Pt(space.size.x * 0.7, space.size.y / 2);
      for (var i = 0; i < count; i++) {
        var p = new Pt(
          Math.floor(Math.random() * space.size.x) + space.size.x / 3,
          Math.floor(Math.random() * space.size.y) + 0
				);
				p.color = ["#f03", "#09f", "#0c6"][i % 3];
        pts.push(p);
      }
    },

    animate: function () {
      var path = [
        new Pt(space.size.x, 0),
        new Pt(space.size.x / 2, space.size.y * -2)
      ];
      pts
        .map(function (p) {
          return [p, Line.perpendicularFromPt(path, p)];
        })
        .sort(function (a, b) {
          return a[1].$subtract(space.pointer).magnitudeSq() - b[1].$subtract(space.pointer).magnitudeSq()
        })
        .forEach(function (p, i) {
          form.fillOnly(p[0].color).point(p[0], 1);
          if (i < 14) {
            form.stroke('rgba(255,255,255,' + (1 - (0.05 * i)) + ')').line(p);
          } else {
            form.stroke('rgba(255,255,255,0.3)').line(p);
          }

          p[0].rotate2D(Const.one_degree / 20, center);
        });
    }

  });

  space.bindMouse().bindTouch().play();

  return function () {
    space.stop();
    space.removeAll();
  };
};

var clear = draw();

window.addEventListener('resize', function () {
  resizew();
});

function resizew(){
  document.getElementById("animation").removeChild(document.getElementById('canvas'));
  var canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'canvas');
  document.getElementById("animation").appendChild(canvas);
  clear();
  clear = draw();
}
