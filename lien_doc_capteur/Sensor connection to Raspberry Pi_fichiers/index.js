function reset() {
  // console.log($(window).width());
  if ($(window).width() < 1000) {
    // $("#markdown-content").height($(window).height()-112);
    // 菜单高度
    $(".bs-docs-sidebar").height($(window).height() - 160);
    // $(".hidden-xs").hide();
  } else {
    // $("#markdown-content").height($(window).height()-60);
    // 菜单高度
    $(".bs-docs-sidebar").height($(window).height() - 60 - 60);
    $(".arrowBtn").height($(window).height());
    $(".leftMenu").height($(window).height());
    // $(".hidden-lg").hide();
  }
}

reset();

$(function () {
  $(window).resize(function () {
    reset();
  });

  //移动端显示
  $("#show-bs-docs-sidebar").click(function () {
    $(".bs-docs-sidebar").animate(
      {
        width: "toggle",
      },
      350
    );
    $("#search-form").animate(
      {
        width: "toggle",
      },
      350
    );
  });

  $(".content,.glyphicon-remove").click(function () {
    if ($(window).width() < 1000) {
      $(".bs-docs-sidebar").hide();
      $("#search-form").hide();
    }
  });
  var parObj = $(".bs-docs-sidenav"); //导航父对象
  var subject_id = $("#subject_id").val(); //当前id
  var currLi; //选中的Li
  parObj.find("li").each(function () {
    var childObj = $(this);
    var childId = childObj.attr("id");
    var arrowObj = childObj.find("i");
    var arrowEventStatus = arrowObj.data("event");
    if (childId == subject_id) {
      currLi = childObj;
      setCur();
    }
    if (arrowEventStatus == undefined) {
      arrowObj.data("event", "mousedown");
      arrowObj.on("mousedown", function () {
        var obj = $(this);
        var navObj = obj.parent().find(".nav").eq(0);
        var status = navObj.css("display");
        if (status == "block") {
          navObj.hide();
          obj.removeClass("glyphicon-menu-down");
          obj.addClass("glyphicon-menu-right");
        } else {
          navObj.show();
          obj.addClass("glyphicon-menu-down");
          obj.removeClass("glyphicon-menu-right");
        }
      });
    }
  });

  pcMenu();

  $(document).ready(function () {
    setPrductInfo();
  });

  //设置产品信息
  function setPrductInfo() {
    var str = window.location.pathname;
    var tempArr = [];
    var SKU = "";
    var title = "";
    var parObj = $(".productInfo");
    var titleObj = parObj.find("h1");
    var skuObj = parObj.find("b");

    try {
      str = str.split("/")[1];
      tempArr = str.split("_");
      SKU = checkSKU(tempArr);
      if (SKU == false) {
        title = str;
        parObj.hide();
        $("#target_0").css({ padding: "0" });
      } else {
        skuObj.html("SKU:" + SKU);
        title = str.split(SKU + "_")[1];
        $(document).ready(function () {
          SKUUrl(skuObj);
        });
      }
      title = title.replace(/_/g, " ");
      title = decodeURI(title);
      if (title != "") {
        titleObj.html(title);
      } else {
        titleObj.hide();
      }
    } catch (e) {
      //TODO handle the exception
      console.log("产品信息抓取失败！");
    }

    function checkSKU(arr) {
      var result = false;
      for (var i in arr) {
        var key = arr[i].toUpperCase();
        if (key == "SKU") {
          var skuIndex = parseInt(i) + 1;
          result = arr[skuIndex];
        }
      }
      return result;
    }
  }

  //
  function SKUUrl(skuObj) {
    var productUrl = "";
    var htmlStr = "";
    $("#top p a").each(function (i) {
      if (i == 0) {
        productUrl = $("#top p a").attr("href");
        if (productUrl != undefined && productUrl != "") {
          htmlStr =
            '<a href="' +
            productUrl +
            '" target="_blank">' +
            skuObj.html() +
            "</a>";
          skuObj.html(htmlStr);
        }
      }
    });
  }

  //PC版菜单控制
  function pcMenu() {
    var arrowObj = $(".leftMenu .menu .arrowBtn");
    var prevKey = "";
    arrowObj.on("mousedown", function () {
      var type = arrowObj.data("type");
      if (type == undefined) {
        type = "show";
        arrowObj.data("type", "show");
      }
      switch (type) {
        case "show":
          pcMenuHide();
          break;
        case "hide":
          pcMenuShow();
          break;
      }
    });
    $(document).keydown(function (event) {
      var e = event || window.event;
      var k = e.keyCode || e.which;
      switch (k) {
        //按Ctrl的时,收起菜单
        case 80:
          if (prevKey == 17) {
            pcMenuHide();
          }
          break;
      }
      prevKey = k;
    });
    function pcMenuHide() {
      var parObj = $(".leftMenu");
      var listObj = parObj.find(".menu");
      var arrowObj = listObj.find(".arrowBtn");
      var conObj = $(".content");
      var conNavObj = $(".content-nav");
      listObj.css({ left: "-299px" });
      arrowObj.data("type", "hide");
      parObj.css({ width: "30px" });
      conObj.css({ width: "calc(100% - 30px)" });
      conNavObj.css({ left: "30px" });
      arrowObj.find("i").css({ transform: "rotate(0deg)" });
    }

    function pcMenuShow() {
      var parObj = $(".leftMenu");
      var listObj = parObj.find(".menu");
      var arrowObj = listObj.find(".arrowBtn");
      var conObj = $(".content");
      var conNavObj = $(".content-nav");
      listObj.css({ left: "0" });
      arrowObj.data("type", "show");
      parObj.css({ width: "330px" });
      conObj.css({ width: "calc(100% - 360px)" });
      conNavObj.css({ left: "350px" });
      arrowObj.find("i").css({ transform: "rotate(180deg)" });
    }
  }

  function setCur() {
    //父级菜单颜色变浅
    currLi.addClass("bright-bg");
    currLi.parents("li").addClass("bright-bg");
    // 父级第一个菜单字体加亮
    currLi.parents("li").each(function (i, li) {
      $(li).find("a").eq(0).addClass("bright");
      //箭头转换
      $(li).find("i").eq(0).removeClass("glyphicon-menu-right");
      $(li).find("i").eq(0).addClass("glyphicon-menu-down");
      $(li).find("i").eq(1).removeClass("glyphicon-triangle-right");
      $(li).find("i").eq(1).addClass("glyphicon-triangle-bottom");
    });
    //当前选中
    currLi.addClass("active_bright");
    //ul展开
    currLi.parents("ul").show();
    currLi.find("ul").eq(0).show();
    //箭头转换
    currLi.find("i").eq(0).removeClass("glyphicon-menu-right");
    currLi.find("i").eq(0).addClass("glyphicon-menu-down");
    currLi.find("i").eq(1).removeClass("glyphicon-triangle-right");
    currLi.find("i").eq(1).addClass("glyphicon-triangle-bottom");

    // 菜单滚动到选中位置
    $(".bs-docs-sidebar").scrollTop(
      currLi.offset().top -
        $(".bs-docs-sidebar").offset().top +
        currLi.scrollTop()
    );
  }

  // 搜索
  $("#search-form").submit(function () {
    var keyword = $("#search-form").find("input").val();
    window.location.href = "/search/" + keyword;
    return false;
  });
  // 正文h标签导
  if ($(".content-nav").length > 0) {
    var html = "";
    $(".markdown-body")
      .find("h1,h2")
      .each(function (i, h) {
        var text = $(h).html();
        var id = "target_" + i;
        // $("<a style='display:block'   name='"+id+"'></a>").insertBefore();
        $(h).attr("id", id);
        html += '<li><a href="#' + id + '">' + text + "</a></li>";
      });
    // 标签 active
    $(".content-nav ul").html(html);
    // 标签 active 有描点
    if ($(".content-nav ul li").length > 0) {
      $(".content-nav ul li").click(function () {
        $(".content-nav ul li").removeClass("active");
        $(this).addClass("active");
      });
      $("body").scrollspy({
        target: "#navbar-content",
      });
    } else {
      $(".content-nav").hide();
      if ($(window).width() > 1000) {
        $("#markdown-content").css({
          "padding-left": "330px",
        });
      }
    }
  }
});
