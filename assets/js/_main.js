/* ==========================================================================
   jQuery plugin settings and other scripts
   ========================================================================== */

$(document).ready(function () {
  // FitVids init
  $("#main").fitVids();

  // Follow menu drop down
  $(".author__urls-wrapper button").on("click", function () {
    $(".author__urls").toggleClass("is--visible");
    $(".author__urls-wrapper").find("button").toggleClass("open");
  });

  // Close search screen with Esc key
  $(document).keyup(function (e) {
    if (e.keyCode === 27) {
      if ($(".initial-content").hasClass("is--hidden")) {
        $(".search-content").toggleClass("is--visible");
        $(".initial-content").toggleClass("is--hidden");
      }
    }
  });

  // Search toggle
  $(".search__toggle").on("click", function () {
    $(".search-content").toggleClass("is--visible");
    $(".initial-content").toggleClass("is--hidden");
    // set focus on input
    setTimeout(function () {
      $(".search-content input").focus();
    }, 400);
  });

  // Smooth scrolling
  var scroll = new SmoothScroll('a[href*="#"]', {
    offset: 20,
    speed: 400,
    speedAsDuration: true,
    durationMax: 500,
  });

  // Gumshoe scroll spy init
if (document.querySelector("nav.toc")) {
  var spy = new Gumshoe("nav.toc a", {
    // Active classes
    navClass: "active", // applied to the nav list item
    contentClass: "active", // applied to the content

    // Nested navigation
    nested: false, // don't add active class to parent items
    nestedClass: "active",

    // Offset & reflow
    offset: 50, // 适当增加 offset，避免过早激活
    reflow: true, // 监听 reflow 以支持动态内容调整

    // Event support
    events: true,
  });
}

// 自动滚动 ToC 以匹配当前激活的内容
const scrollTocToContent = function (event) {
  var target = event.target;
  var tocElement = document.querySelector("aside.sidebar__right.sticky");
  if (!tocElement) return;

  // 仅在 ToC 为 sticky 状态时执行
  if (window.getComputedStyle(tocElement).position !== "sticky") return;

  // 计算元素相对于视口的偏移
  var targetRect = target.getBoundingClientRect();
  var viewportHeight = window.innerHeight;

  // 仅当目标项超出视口时才滚动
  if (targetRect.top < 10 || targetRect.bottom > viewportHeight - 10) {
    target.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
};

// 监听 ToC 内部链接点击，确保滚动后保持可见
document.querySelectorAll(".toc__menu a").forEach((link) => {
  link.addEventListener("click", (event) => {
    setTimeout(() => {
      scrollTocToContent(event);
    }, 100); // 延迟确保滚动完成后调整
  });
});


  // Has issues on Firefox, whitelist Chrome for now
  if (!!window.chrome) {
    document.addEventListener("gumshoeActivate", scrollTocToContent);
  }

  // add lightbox class to all image links
  $(
    "a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.gif'],a[href$='.webp']"
  ).has("> img").addClass("image-popup");

  // Magnific-Popup options
  $(".image-popup").magnificPopup({
    // disableOn: function() {
    //   if( $(window).width() < 500 ) {
    //     return false;
    //   }
    //   return true;
    // },
    type: "image",
    tLoading: "Loading image #%curr%...",
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1], // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      tError: '<a href="%url%">Image #%curr%</a> could not be loaded.',
    },
    removalDelay: 500, // Delay in milliseconds before popup is removed
    // Class that is added to body when popup is open.
    // make it unique to apply your CSS animations just to this exact popup
    mainClass: "mfp-zoom-in",
    callbacks: {
      beforeOpen: function () {
        // just a hack that adds mfp-anim class to markup
        this.st.image.markup = this.st.image.markup.replace(
          "mfp-figure",
          "mfp-figure mfp-with-anim"
        );
      },
    },
    closeOnContentClick: true,
    midClick: true, // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
  });

  // Add anchors for headings
  (function () {
    var pageContentElement = document.querySelector(".page__content");
    if (!pageContentElement) return;

    pageContentElement
      .querySelectorAll("h1, h2, h3, h4, h5, h6")
      .forEach(function (element) {
        var id = element.getAttribute("id");
        if (id) {
          var anchor = document.createElement("a");
          anchor.className = "header-link";
          anchor.href = "#" + id;
          anchor.innerHTML =
            '<span class="sr-only">Permalink</span><i class="fas fa-link"></i>';
          anchor.title = "Permalink";
          element.appendChild(anchor);
        }
      });
  })();

  // Add copy button for <pre> blocks
  var copyText = function (text) {
    if (document.queryCommandEnabled("copy") && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => true,
        () => console.error("Failed to copy text to clipboard: " + text)
      );
      return true;
    } else {
      var isRTL = document.documentElement.getAttribute("dir") === "rtl";

      var textarea = document.createElement("textarea");
      textarea.className = "clipboard-helper";
      textarea.style[isRTL ? "right" : "left"] = "-9999px";
      // Move element to the same position vertically
      var yPosition = window.pageYOffset || document.documentElement.scrollTop;
      textarea.style.top = yPosition + "px";

      textarea.setAttribute("readonly", "");
      textarea.value = text;
      document.body.appendChild(textarea);

      var success = true;
      try {
        textarea.select();
        success = document.execCommand("copy");
      } catch (e) {
        success = false;
      }
      textarea.parentNode.removeChild(textarea);
      return success;
    }
  };

  var copyButtonEventListener = function (event) {
    var thisButton = event.target;

    // Locate the <code> element
    var codeBlock = thisButton.nextElementSibling;
    while (codeBlock && codeBlock.tagName.toLowerCase() !== "code") {
      codeBlock = codeBlock.nextElementSibling;
    }
    if (!codeBlock) {
      // No <code> found - wtf?
      console.warn(thisButton);
      throw new Error("No code block found for this button.");
    }

    // Skip line numbers if present (i.e. {% highlight lineno %})
    var realCodeBlock = codeBlock.querySelector("td.code, td.rouge-code");
    if (realCodeBlock) {
      codeBlock = realCodeBlock;
    }
    var result = copyText(codeBlock.innerText);
    // Restore the focus to the button
    thisButton.focus();
    if (result) {
      if (thisButton.interval !== null) {
        clearInterval(thisButton.interval);
      }
      thisButton.classList.add('copied');
      thisButton.interval = setTimeout(function () {
        thisButton.classList.remove('copied');
        clearInterval(thisButton.interval);
        thisButton.interval = null;
      }, 1500);
    }
    return result;
  };

  if (window.enable_copy_code_button) {
    document
      .querySelectorAll(".page__content pre.highlight > code")
      .forEach(function (element, index, parentList) {
        // Locate the <pre> element
        var container = element.parentElement;
        // Sanity check - don't add an extra button if there's already one
        if (container.firstElementChild.tagName.toLowerCase() !== "code") {
          return;
        }
        var copyButton = document.createElement("button");
        copyButton.title = "Copy to clipboard";
        copyButton.className = "clipboard-copy-button";
        copyButton.innerHTML = '<span class="sr-only">Copy code</span><i class="far fa-fw fa-copy"></i><i class="fas fa-fw fa-check copied"></i>';
        copyButton.addEventListener("click", copyButtonEventListener);
        container.prepend(copyButton);
      });
  }
});
