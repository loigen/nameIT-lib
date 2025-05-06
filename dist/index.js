// src/theme/tokens.ts
var colors = {
  primary: "#3b82f6",
  secondary: "#6366f1",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  background: "#ffffff",
  foreground: "#1f2937"
};
var spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px"
};
var fonts = {
  body: "'Inter', sans-serif",
  heading: "'Poppins', sans-serif"
};
var breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px"
};

// src/theme/mode.ts
var currentMode = "light";
function setTheme(mode) {
  currentMode = mode;
  document.documentElement.setAttribute("data-theme", mode);
}
function getTheme() {
  return currentMode;
}

// src/utils/baseStyles.ts
function applyBaseStyles(options) {
  const theme = getTheme();
  const { element, type = "text", size = "md", rounded = false, shadow = false, bordered = false } = options;
  element.style.margin = "0";
  element.style.padding = "0";
  element.style.boxSizing = "border-box";
  switch (type) {
    case "heading":
      element.style.fontFamily = fonts.heading;
      element.style.fontWeight = "600";
      element.style.lineHeight = "1.25";
      break;
    case "interactive":
      element.style.fontFamily = fonts.body;
      element.style.cursor = "pointer";
      element.style.userSelect = "none";
      break;
    default:
      element.style.fontFamily = fonts.body;
      element.style.lineHeight = "1.5";
  }
  switch (size) {
    case "xs":
      element.style.fontSize = "0.75rem";
      break;
    case "sm":
      element.style.fontSize = "0.875rem";
      break;
    case "md":
      element.style.fontSize = "1rem";
      break;
    case "lg":
      element.style.fontSize = "1.125rem";
      break;
    case "xl":
      element.style.fontSize = "1.25rem";
      break;
  }
  if (type === "container") {
    element.style.backgroundColor = theme === "dark" ? colors.foreground : colors.background;
    element.style.color = theme === "dark" ? colors.background : colors.foreground;
  } else {
    element.style.color = theme === "dark" ? colors.background : colors.foreground;
  }
  if (bordered) {
    element.style.border = `1px solid ${theme === "dark" ? colors.background : colors.foreground}`;
    element.style.borderRadius = rounded ? "50%" : "4px";
  } else if (rounded) {
    element.style.borderRadius = "50%";
  }
  if (shadow) {
    element.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
  }
  if (type === "interactive") {
    element.style.transition = "all 0.2s ease";
  }
}

// src/components/Button/index.ts
var Button = class {
  constructor(options) {
    this.element = document.createElement("button");
    this.element.textContent = options.text;
    this.element.type = options.type || "button";
    applyBaseStyles({
      element: this.element,
      type: "interactive",
      size: options.size || "md",
      rounded: false,
      bordered: true
    });
    this.applyVariantStyles(options.variant || "primary");
    this.applySizeStyles(options.size || "md");
    this.element.disabled = options.disabled || false;
    if (options.onClick) {
      this.element.addEventListener("click", options.onClick);
    }
  }
  applyVariantStyles(variant) {
    const theme = getTheme();
    const isDark = theme === "dark";
    const textColor = isDark ? colors.foreground : colors.background;
    switch (variant) {
      case "primary":
        this.element.style.backgroundColor = colors.primary;
        break;
      case "secondary":
        this.element.style.backgroundColor = colors.secondary;
        break;
      case "success":
        this.element.style.backgroundColor = colors.success;
        break;
      case "warning":
        this.element.style.backgroundColor = colors.warning;
        break;
      case "error":
        this.element.style.backgroundColor = colors.error;
        break;
      default:
        this.element.style.backgroundColor = colors.primary;
    }
    this.element.style.color = textColor;
    this.element.addEventListener("mouseenter", () => {
      this.element.style.opacity = "0.9";
    });
    this.element.addEventListener("mouseleave", () => {
      this.element.style.opacity = "1";
    });
  }
  applySizeStyles(size) {
    switch (size) {
      case "sm":
        this.element.style.padding = `${spacing.xs} ${spacing.sm}`;
        this.element.style.fontSize = "0.875rem";
        break;
      case "md":
        this.element.style.padding = `${spacing.sm} ${spacing.md}`;
        this.element.style.fontSize = "1rem";
        break;
      case "lg":
        this.element.style.padding = `${spacing.md} ${spacing.lg}`;
        this.element.style.fontSize = "1.125rem";
        break;
      default:
        this.element.style.padding = `${spacing.sm} ${spacing.md}`;
        this.element.style.fontSize = "1rem";
        break;
    }
  }
  render() {
    return this.element;
  }
  setText(text) {
    this.element.textContent = text;
  }
  setDisabled(disabled) {
    this.element.disabled = disabled;
    this.element.style.opacity = disabled ? "0.7" : "1";
    this.element.style.cursor = disabled ? "not-allowed" : "pointer";
  }
  destroy() {
    this.element.remove();
  }
};

// src/components/Dropdown/index.ts
var Dropdown = class {
  constructor(options) {
    this.options = options;
    this.isOpen = false;
    this.container = document.createElement("div");
    applyBaseStyles({
      element: this.container,
      type: "container",
      size: options.size || "md"
    });
    this.container.style.position = "relative";
    this.container.style.display = "inline-block";
    this.trigger = document.createElement("button");
    this.trigger.textContent = options.triggerText;
    applyBaseStyles({
      element: this.container,
      type: "interactive",
      size: this.options.size || "md",
      rounded: false,
      bordered: false
    });
    this.trigger.style.padding = `${spacing.sm} ${spacing.md}`;
    this.trigger.addEventListener("click", this.toggle.bind(this));
    this.menu = document.createElement("div");
    applyBaseStyles({
      element: this.menu,
      type: "container",
      size: options.size || "md",
      shadow: true,
      bordered: true
    });
    this.menu.style.position = "absolute";
    this.menu.style[options.align || "left"] = "0";
    this.menu.style.top = "100%";
    this.menu.style.marginTop = spacing.xs;
    this.menu.style.minWidth = "160px";
    this.menu.style.zIndex = "1000";
    this.menu.style.display = "none";
    options.items.forEach((item) => {
      const menuItem = document.createElement("button");
      menuItem.textContent = item.text;
      applyBaseStyles({
        element: menuItem,
        type: "interactive",
        size: options.size || "md"
      });
      menuItem.style.display = "block";
      menuItem.style.width = "100%";
      menuItem.style.textAlign = "left";
      menuItem.style.border = "none";
      menuItem.style.borderRadius = "0";
      menuItem.addEventListener("mouseenter", () => {
        menuItem.style.backgroundColor = "rgba(0,0,0,0.1)";
      });
      menuItem.addEventListener("mouseleave", () => {
        menuItem.style.backgroundColor = "transparent";
      });
      menuItem.addEventListener("click", () => {
        item.action();
        this.close();
      });
      this.menu.appendChild(menuItem);
    });
    this.container.appendChild(this.trigger);
    this.container.appendChild(this.menu);
  }
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  open() {
    this.isOpen = true;
    this.menu.style.display = "block";
  }
  close() {
    this.isOpen = false;
    this.menu.style.display = "none";
  }
  render() {
    return this.container;
  }
  destroy() {
    this.trigger.removeEventListener("click", this.toggle);
    this.container.remove();
  }
};

// src/components/ErrorBoundary/index.ts
var ErrorBoundary = class {
  constructor(options = {}) {
    this.currentChild = null;
    this.container = document.createElement("div");
    this.options = options;
  }
  render(child) {
    try {
      this.container.innerHTML = "";
      if (this.currentChild) {
        this.container.removeChild(this.currentChild);
      }
      this.container.appendChild(child);
      this.currentChild = child;
      return this.container;
    } catch (error) {
      return this.handleError(error);
    }
  }
  handleError(error) {
    if (this.options.onError) {
      const errorInfo = {
        componentStack: this.getComponentStack(error)
      };
      this.options.onError(error, errorInfo);
    }
    this.container.innerHTML = "";
    if (this.options.fallback) {
      this.container.appendChild(this.options.fallback(error));
    } else {
      this.container.appendChild(this.createDefaultFallback(error));
    }
    return this.container;
  }
  createDefaultFallback(error) {
    const theme = getTheme();
    const fallbackContainer = document.createElement("div");
    fallbackContainer.style.padding = "1rem";
    fallbackContainer.style.borderRadius = "4px";
    fallbackContainer.style.backgroundColor = theme === "dark" ? `${colors.error}20` : `${colors.error}10`;
    fallbackContainer.style.border = `1px solid ${colors.error}`;
    fallbackContainer.style.color = theme === "dark" ? colors.background : colors.foreground;
    const title = document.createElement("h3");
    title.textContent = "Something went wrong";
    title.style.marginTop = "0";
    title.style.color = colors.error;
    fallbackContainer.appendChild(title);
    const message = document.createElement("p");
    message.textContent = error.message;
    message.style.marginBottom = "0.5rem";
    fallbackContainer.appendChild(message);
    if (process.env.NODE_ENV === "development") {
      const stack = document.createElement("details");
      stack.style.marginTop = "1rem";
      const summary = document.createElement("summary");
      summary.textContent = "Error details";
      summary.style.cursor = "pointer";
      stack.appendChild(summary);
      const pre = document.createElement("pre");
      pre.style.whiteSpace = "pre-wrap";
      pre.style.fontFamily = "monospace";
      pre.textContent = error.stack || "No stack trace available";
      stack.appendChild(pre);
      fallbackContainer.appendChild(stack);
    }
    const button = document.createElement("button");
    button.textContent = "Try again";
    button.style.marginTop = "1rem";
    button.style.padding = "0.5rem 1rem";
    button.style.backgroundColor = colors.error;
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "4px";
    button.style.cursor = "pointer";
    button.addEventListener("click", () => {
      if (this.currentChild) {
        this.render(this.currentChild);
      }
    });
    fallbackContainer.appendChild(button);
    return fallbackContainer;
  }
  getComponentStack(error) {
    return error.stack || "Component stack not available";
  }
  destroy() {
    this.container.innerHTML = "";
    this.currentChild = null;
  }
};

// src/components/Image/index.ts
var Image = class {
  constructor(options) {
    this.options = options;
    this.container = document.createElement("div");
    this.imgElement = document.createElement("img");
    this.setupContainer();
    this.setupImageElement();
    this.setupLoadingStrategy();
  }
  setupContainer() {
    this.container.style.position = "relative";
    this.container.style.display = "inline-block";
    this.container.style.overflow = "hidden";
    if (this.options.width) {
      this.container.style.width = typeof this.options.width === "number" ? `${this.options.width}px` : this.options.width;
    }
    if (this.options.height) {
      this.container.style.height = typeof this.options.height === "number" ? `${this.options.height}px` : this.options.height;
    }
    if (this.options.aspectRatio) {
      this.container.style.aspectRatio = this.options.aspectRatio;
    }
    if (this.options.rounded) {
      this.container.style.borderRadius = "50%";
    } else {
      this.container.style.borderRadius = "4px";
    }
    if (this.options.bordered) {
      const theme = getTheme();
      this.container.style.border = `1px solid ${theme === "dark" ? colors.background : colors.foreground}`;
    }
  }
  setupImageElement() {
    this.imgElement.alt = this.options.alt || "";
    this.imgElement.style.width = "100%";
    this.imgElement.style.height = "100%";
    this.imgElement.style.objectFit = "cover";
    this.imgElement.style.transition = "opacity 0.3s ease";
    this.imgElement.style.opacity = "0";
    if (this.options.placeholder) {
      this.imgElement.style.background = this.options.placeholder;
    }
    this.imgElement.addEventListener("load", () => {
      this.imgElement.style.opacity = "1";
      if (this.options.onLoad)
        this.options.onLoad();
    });
    this.imgElement.addEventListener("error", () => {
      if (this.options.debug) {
        console.error(`Image failed to load: ${this.options.src}`);
      }
      if (this.options.onError)
        this.options.onError();
      this.showErrorState();
    });
  }
  setupLoadingStrategy() {
    if (this.options.lazy && "IntersectionObserver" in window) {
      this.setupLazyLoading();
    } else {
      this.loadImageImmediately();
    }
  }
  setupLazyLoading() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadImage();
          this.observer?.unobserve(this.container);
        }
      });
    }, {
      rootMargin: "200px"
    });
    this.observer.observe(this.container);
  }
  loadImageImmediately() {
    this.loadImage();
  }
  loadImage() {
    if (this.options.placeholder) {
      const placeholder = document.createElement("div");
      placeholder.style.position = "absolute";
      placeholder.style.inset = "0";
      placeholder.style.background = this.options.placeholder;
      this.container.appendChild(placeholder);
    }
    this.imgElement.src = this.options.src;
    this.container.appendChild(this.imgElement);
  }
  showErrorState() {
    const theme = getTheme();
    const errorContainer = document.createElement("div");
    errorContainer.style.position = "absolute";
    errorContainer.style.inset = "0";
    errorContainer.style.display = "flex";
    errorContainer.style.alignItems = "center";
    errorContainer.style.justifyContent = "center";
    errorContainer.style.backgroundColor = theme === "dark" ? `${colors.error}20` : `${colors.error}10`;
    errorContainer.style.color = colors.error;
    errorContainer.style.fontFamily = "sans-serif";
    errorContainer.style.fontSize = "0.875rem";
    errorContainer.textContent = "Image failed to load";
    this.container.appendChild(errorContainer);
  }
  render() {
    return this.container;
  }
  update(newOptions) {
    this.options = { ...this.options, ...newOptions };
    this.container.innerHTML = "";
    this.imgElement = document.createElement("img");
    this.setupContainer();
    this.setupImageElement();
    this.setupLoadingStrategy();
  }
  destroy() {
    this.observer?.disconnect();
    this.container.remove();
  }
};

// src/components/Input/index.ts
var Input = class {
  constructor(options = {}) {
    this.labelElement = null;
    this.errorElement = null;
    this.helperElement = null;
    this.prefixElement = null;
    this.suffixElement = null;
    this.options = {
      type: "text",
      size: "md",
      ...options
    };
    this.container = document.createElement("div");
    this.inputElement = document.createElement("input");
    this.setupContainer();
    this.setupInputElement();
    this.setupLabel();
    this.setupIcons();
    this.setupHelperText();
    this.setupErrorState();
  }
  setupContainer() {
    this.container.style.display = "flex";
    this.container.style.flexDirection = "column";
    this.container.style.gap = spacing.xs;
    this.container.style.width = "100%";
  }
  setupInputElement() {
    const theme = getTheme();
    this.inputElement.type = this.options.type || "text";
    this.inputElement.value = this.options.value || "";
    if (this.options.placeholder) {
      this.inputElement.placeholder = this.options.placeholder;
    }
    this.inputElement.disabled = this.options.disabled || false;
    this.inputElement.required = this.options.required || false;
    if (this.options.autocomplete) {
      this.inputElement.autocomplete = this.options.autocomplete;
    }
    this.inputElement.style.fontFamily = fonts.body;
    this.inputElement.style.color = theme === "dark" ? colors.background : colors.foreground;
    this.inputElement.style.backgroundColor = theme === "dark" ? colors.foreground : colors.background;
    this.inputElement.style.border = `1px solid ${theme === "dark" ? colors.background : colors.foreground}`;
    this.inputElement.style.outline = "none";
    this.inputElement.style.transition = "all 0.2s ease";
    this.inputElement.style.boxSizing = "border-box";
    this.inputElement.style.width = "100%";
    switch (this.options.size) {
      case "sm":
        this.inputElement.style.padding = `${spacing.xs} ${spacing.sm}`;
        this.inputElement.style.fontSize = "0.875rem";
        this.inputElement.style.borderRadius = this.options.rounded ? "12px" : "4px";
        break;
      case "lg":
        this.inputElement.style.padding = `${spacing.md} ${spacing.lg}`;
        this.inputElement.style.fontSize = "1.125rem";
        this.inputElement.style.borderRadius = this.options.rounded ? "20px" : "6px";
        break;
      default:
        this.inputElement.style.padding = `${spacing.sm} ${spacing.md}`;
        this.inputElement.style.fontSize = "1rem";
        this.inputElement.style.borderRadius = this.options.rounded ? "16px" : "4px";
    }
    this.inputElement.addEventListener("focus", (e) => {
      this.inputElement.style.borderColor = colors.primary;
      this.inputElement.style.boxShadow = `0 0 0 2px ${colors.primary}20`;
      if (this.options.onFocus)
        this.options.onFocus(e);
    });
    this.inputElement.addEventListener("blur", (e) => {
      this.inputElement.style.borderColor = theme === "dark" ? colors.background : colors.foreground;
      this.inputElement.style.boxShadow = "none";
      if (this.options.onBlur)
        this.options.onBlur(e);
    });
    this.inputElement.addEventListener("input", (e) => {
      if (this.options.onChange) {
        this.options.onChange(this.inputElement.value, e);
      }
    });
    this.inputElement.addEventListener("keydown", (e) => {
      if (this.options.onKeyDown) {
        this.options.onKeyDown(e);
      }
    });
    this.container.appendChild(this.inputElement);
  }
  setupLabel() {
    if (!this.options.label)
      return;
    this.labelElement = document.createElement("label");
    this.labelElement.textContent = this.options.label;
    this.labelElement.style.fontFamily = fonts.body;
    this.labelElement.style.fontSize = "0.875rem";
    this.labelElement.style.color = getTheme() === "dark" ? colors.background : colors.foreground;
    this.labelElement.style.marginBottom = spacing.xs;
    if (this.options.required) {
      const requiredSpan = document.createElement("span");
      requiredSpan.textContent = " *";
      requiredSpan.style.color = colors.error;
      this.labelElement.appendChild(requiredSpan);
    }
    this.container.insertBefore(this.labelElement, this.container.firstChild);
  }
  setupIcons() {
    if (this.options.prefixIcon || this.options.suffixIcon) {
      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.alignItems = "center";
      wrapper.style.position = "relative";
      wrapper.style.width = "100%";
      this.container.removeChild(this.inputElement);
      wrapper.appendChild(this.inputElement);
      if (this.options.prefixIcon) {
        this.prefixElement = document.createElement("span");
        this.prefixElement.textContent = this.options.prefixIcon;
        this.prefixElement.style.position = "absolute";
        this.prefixElement.style.left = spacing.sm;
        this.prefixElement.style.pointerEvents = "none";
        wrapper.insertBefore(this.prefixElement, this.inputElement);
        this.inputElement.style.paddingLeft = `calc(${this.inputElement.style.paddingLeft} + 24px)`;
      }
      if (this.options.suffixIcon) {
        this.suffixElement = document.createElement("span");
        this.suffixElement.textContent = this.options.suffixIcon;
        this.suffixElement.style.position = "absolute";
        this.suffixElement.style.right = spacing.sm;
        this.suffixElement.style.pointerEvents = "none";
        wrapper.appendChild(this.suffixElement);
        this.inputElement.style.paddingRight = `calc(${this.inputElement.style.paddingRight} + 24px)`;
      }
      this.container.appendChild(wrapper);
    }
  }
  setupHelperText() {
    if (!this.options.helperText)
      return;
    this.helperElement = document.createElement("p");
    this.helperElement.textContent = this.options.helperText;
    this.helperElement.style.fontFamily = fonts.body;
    this.helperElement.style.fontSize = "0.75rem";
    this.helperElement.style.color = getTheme() === "dark" ? `${colors.background}80` : `${colors.foreground}80`;
    this.helperElement.style.margin = "0";
    this.helperElement.style.marginTop = spacing.xs;
    this.container.appendChild(this.helperElement);
  }
  setupErrorState() {
    if (!this.options.error)
      return;
    this.errorElement = document.createElement("p");
    this.errorElement.textContent = this.options.error;
    this.errorElement.style.fontFamily = fonts.body;
    this.errorElement.style.fontSize = "0.75rem";
    this.errorElement.style.color = colors.error;
    this.errorElement.style.margin = "0";
    this.errorElement.style.marginTop = spacing.xs;
    this.inputElement.style.borderColor = colors.error;
    this.container.appendChild(this.errorElement);
  }
  getValue() {
    return this.inputElement.value;
  }
  setValue(value) {
    this.inputElement.value = value;
  }
  setError(error) {
    if (this.errorElement) {
      this.container.removeChild(this.errorElement);
      this.errorElement = null;
    }
    if (error) {
      this.errorElement = document.createElement("p");
      this.errorElement.textContent = error;
      this.errorElement.style.fontFamily = fonts.body;
      this.errorElement.style.fontSize = "0.75rem";
      this.errorElement.style.color = colors.error;
      this.errorElement.style.margin = "0";
      this.errorElement.style.marginTop = spacing.xs;
      this.inputElement.style.borderColor = colors.error;
      this.container.appendChild(this.errorElement);
    } else {
      const theme = getTheme();
      this.inputElement.style.borderColor = theme === "dark" ? colors.background : colors.foreground;
    }
  }
  focus() {
    this.inputElement.focus();
  }
  blur() {
    this.inputElement.blur();
  }
  render() {
    return this.container;
  }
  destroy() {
    this.inputElement.remove();
    this.container.remove();
  }
};

// src/components/Loader/index.ts
var Loader = class {
  constructor(options = {}) {
    this.messageElement = null;
    this.options = {
      type: "spinner",
      size: "md",
      ...options
    };
    this.container = document.createElement("div");
    this.loaderElement = document.createElement("div");
    this.setupContainer();
    this.createLoader();
    this.setupMessage();
  }
  setupContainer() {
    this.container.style.display = "inline-flex";
    this.container.style.flexDirection = "column";
    this.container.style.alignItems = "center";
    this.container.style.justifyContent = "center";
    this.container.style.gap = "8px";
  }
  createLoader() {
    const color = this.options.color || (getTheme() === "dark" ? colors.background : colors.foreground);
    const size = this.getSizeValue(this.options.size);
    switch (this.options.type) {
      case "dots":
        this.createDotsLoader(color, size);
        break;
      case "bar":
        this.createBarLoader(color, size);
        break;
      case "progress":
        this.createProgressLoader(color, size);
        break;
      case "spinner":
      default:
        this.createSpinnerLoader(color, size);
        break;
    }
  }
  createSpinnerLoader(color, size) {
    this.loaderElement.style.width = `${size}px`;
    this.loaderElement.style.height = `${size}px`;
    this.loaderElement.style.border = `${Math.max(2, size / 10)}px solid rgba(0, 0, 0, 0.1)`;
    this.loaderElement.style.borderRadius = "50%";
    this.loaderElement.style.borderTopColor = color;
    this.loaderElement.style.animation = "spin 1s linear infinite";
    this.addKeyframes(`
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `);
    this.container.appendChild(this.loaderElement);
  }
  createBarLoader(color, size) {
    const barHeight = Math.max(4, size / 4);
    const barWidth = size * 2;
    this.loaderElement.style.width = `${barWidth}px`;
    this.loaderElement.style.height = `${barHeight}px`;
    this.loaderElement.style.backgroundColor = `${color}20`;
    this.loaderElement.style.borderRadius = `${barHeight / 2}px`;
    this.loaderElement.style.overflow = "hidden";
    const progressBar = document.createElement("div");
    progressBar.style.height = "100%";
    progressBar.style.width = `${this.options.progress || 0}%`;
    progressBar.style.backgroundColor = color;
    progressBar.style.borderRadius = `${barHeight / 2}px`;
    progressBar.style.transition = "width 0.3s ease";
    this.loaderElement.appendChild(progressBar);
    this.container.appendChild(this.loaderElement);
  }
  createProgressLoader(color, size) {
    this.createBarLoader(color, size);
  }
  createDotsLoader(color, size) {
    this.loaderElement.style.display = "flex";
    this.loaderElement.style.gap = "4px";
    this.addKeyframes(`
            @keyframes bounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
            }
        `);
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("div");
      dot.style.width = `${size / 4}px`;
      dot.style.height = `${size / 4}px`;
      dot.style.backgroundColor = color;
      dot.style.borderRadius = "50%";
      dot.style.animation = `bounce 1.4s infinite ease-in-out both`;
      dot.style.animationDelay = `${i * 0.16}s`;
      this.loaderElement.appendChild(dot);
    }
    this.container.appendChild(this.loaderElement);
  }
  setupMessage() {
    if (this.options.message) {
      this.messageElement = document.createElement("div");
      this.messageElement.textContent = this.options.message;
      this.messageElement.style.fontFamily = "inherit";
      this.messageElement.style.fontSize = this.getFontSize(this.options.size);
      this.messageElement.style.color = getTheme() === "dark" ? colors.background : colors.foreground;
      this.container.appendChild(this.messageElement);
    }
  }
  addKeyframes(css) {
    const style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);
  }
  getSizeValue(size = "md") {
    switch (size) {
      case "sm":
        return 24;
      case "lg":
        return 48;
      default:
        return 32;
    }
  }
  getFontSize(size = "md") {
    switch (size) {
      case "sm":
        return "0.75rem";
      case "lg":
        return "1rem";
      default:
        return "0.875rem";
    }
  }
  setProgress(progress) {
    if (this.options.type === "progress" || this.options.type === "bar") {
      const progressBar = this.loaderElement.firstChild;
      if (progressBar) {
        progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
      }
    }
  }
  setMessage(message) {
    if (this.messageElement) {
      this.messageElement.textContent = message;
    } else if (message) {
      this.messageElement = document.createElement("div");
      this.messageElement.textContent = message;
      this.messageElement.style.fontFamily = "inherit";
      this.messageElement.style.fontSize = this.getFontSize(this.options.size);
      this.messageElement.style.color = getTheme() === "dark" ? colors.background : colors.foreground;
      this.container.appendChild(this.messageElement);
    }
  }
  setType(type) {
    if (type !== this.options.type) {
      this.options.type = type;
      this.loaderElement.remove();
      this.loaderElement = document.createElement("div");
      this.createLoader();
    }
  }
  render() {
    return this.container;
  }
  destroy() {
    this.container.remove();
    document.querySelectorAll("style").forEach((style) => {
      if (style.innerHTML.includes("@keyframes spin") || style.innerHTML.includes("@keyframes bounce")) {
        style.remove();
      }
    });
  }
};

// src/components/Navigation/index.ts
var Navigation = class {
  constructor(containerId) {
    this.isOpen = false;
    this.navLinks = [];
    const container = document.getElementById(containerId);
    if (!container)
      throw new Error(`Navigation container "${containerId}" not found.`);
    this.container = container;
  }
  render(links) {
    this.navLinks = links;
    this.container.innerHTML = "";
    const wrapper = document.createElement("div");
    wrapper.style.backgroundColor = colors.primary;
    wrapper.style.color = colors.background;
    wrapper.style.fontFamily = fonts.body;
    const topBar = document.createElement("div");
    topBar.className = "flex items-center justify-between";
    topBar.style.padding = spacing.md;
    const brand = document.createElement("span");
    brand.textContent = "MyApp";
    brand.style.fontFamily = fonts.heading;
    brand.style.fontSize = "1.25rem";
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "md:hidden";
    toggleBtn.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
                              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M4 6h16M4 12h16M4 18h16"></path>
                          </svg>`;
    toggleBtn.onclick = () => this.toggleMenu();
    topBar.appendChild(brand);
    topBar.appendChild(toggleBtn);
    const linkContainer = document.createElement("div");
    linkContainer.id = "nav-links";
    linkContainer.className = "hidden md:flex md:space-x-4";
    linkContainer.style.padding = spacing.md;
    if (links.length === 0) {
      const empty = document.createElement("span");
      empty.textContent = "No navigation items available";
      empty.style.color = colors.warning;
      linkContainer.appendChild(empty);
    } else {
      links.forEach((link) => {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.label;
        a.style.padding = spacing.sm;
        a.style.borderRadius = "4px";
        a.style.cursor = "pointer";
        a.className = "hover:underline";
        linkContainer.appendChild(a);
      });
    }
    wrapper.appendChild(topBar);
    wrapper.appendChild(linkContainer);
    this.container.appendChild(wrapper);
  }
  toggleMenu() {
    this.isOpen = !this.isOpen;
    const linksEl = document.getElementById("nav-links");
    if (linksEl) {
      linksEl.className = `${this.isOpen ? "flex" : "hidden"} flex-col md:flex md:flex-row md:space-x-4`;
    }
  }
};

// src/components/Search/index.ts
var SearchBar = class {
  constructor(containerId, options) {
    const container = document.getElementById(containerId);
    if (!container)
      throw new Error(`Search container "${containerId}" not found.`);
    this.container = container;
    this.options = options;
    this.render();
  }
  render() {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = this.options.placeholder || "Search...";
    input.style.padding = spacing.sm;
    input.style.border = `1px solid ${colors.foreground}`;
    input.style.borderRadius = "4px";
    input.style.width = "100%";
    input.style.fontFamily = fonts.body;
    input.addEventListener("input", () => {
      const value = input.value;
      this.options.onSearch?.(value);
    });
    this.container.appendChild(input);
  }
};

// src/components/Table/index.ts
var Table = class {
  constructor(containerId) {
    const container = document.getElementById(containerId);
    if (!container)
      throw new Error(`Table container "${containerId}" not found.`);
    this.container = container;
  }
  render(props) {
    this.container.innerHTML = "";
    if (props.data.length === 0) {
      const message = document.createElement("p");
      message.textContent = props.emptyMessage || "No data available";
      message.style.textAlign = "center";
      message.style.color = colors.warning;
      message.style.fontFamily = fonts.body;
      this.container.appendChild(message);
      return;
    }
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.fontFamily = fonts.body;
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    props.columns.forEach((col) => {
      const th = document.createElement("th");
      th.textContent = col;
      th.style.padding = spacing.sm;
      th.style.border = `1px solid ${colors.foreground}`;
      th.style.backgroundColor = colors.secondary;
      th.style.color = colors.background;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    props.data.forEach((row) => {
      const tr = document.createElement("tr");
      props.columns.forEach((col) => {
        const td = document.createElement("td");
        td.textContent = row[col] || "";
        td.style.padding = spacing.sm;
        td.style.border = `1px solid ${colors.foreground}`;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    this.container.appendChild(table);
  }
};

// src/hooks/useToast.ts
var ToastManager = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Set();
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  show(toast2) {
    const toastWithId = { ...toast2, id: crypto.randomUUID() };
    this.listeners.forEach((listener) => listener(toastWithId));
  }
};
var toast = new ToastManager();

// src/components/Toast/index.ts
var Toast = class {
  constructor() {
    this.container = document.createElement("div");
    this.container.style.position = "fixed";
    this.container.style.top = spacing.md;
    this.container.style.right = spacing.md;
    this.container.style.zIndex = "9999";
    this.container.style.display = "flex";
    this.container.style.flexDirection = "column";
    this.container.style.gap = spacing.sm;
    document.body.appendChild(this.container);
    toast.subscribe(this.showToast.bind(this));
  }
  showToast(toastData) {
    const toastEl = document.createElement("div");
    toastEl.textContent = toastData.message;
    toastEl.setAttribute("data-id", toastData.id);
    toastEl.style.backgroundColor = this.getBackgroundColor(toastData.type);
    toastEl.style.color = colors.background;
    toastEl.style.padding = spacing.sm;
    toastEl.style.borderRadius = "6px";
    toastEl.style.fontFamily = fonts.body;
    toastEl.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
    toastEl.style.opacity = "1";
    toastEl.style.transition = "opacity 0.3s ease";
    this.container.appendChild(toastEl);
    setTimeout(() => {
      toastEl.style.opacity = "0";
      setTimeout(() => {
        this.container.removeChild(toastEl);
      }, 300);
    }, toastData.duration || 3e3);
  }
  getBackgroundColor(type) {
    switch (type) {
      case "success":
        return colors.success;
      case "error":
        return colors.error;
      case "info":
      default:
        return colors.secondary;
    }
  }
};

// src/hooks/useFormValidation.ts
function validateForm(data, rules) {
  const errors = {};
  for (const rule of rules) {
    if (!rule.validate(data[rule.field])) {
      errors[rule.field] = rule.message;
    }
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

// src/hooks/useLazyImage.ts
function lazyLoadImage(imgElement, rootMargin = "0px") {
  if (!("IntersectionObserver" in window)) {
    imgElement.src = imgElement.dataset.src || "";
    return;
  }
  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.src = el.dataset.src || "";
          observerInstance.unobserve(el);
        }
      });
    }
  );
  {
    rootMargin;
  }
}

// src/utils/number.ts
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function roundTo(value, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
export {
  Button,
  Dropdown,
  ErrorBoundary,
  Image,
  Input,
  Loader,
  Navigation,
  SearchBar,
  Table,
  Toast,
  applyBaseStyles,
  breakpoints,
  clamp,
  colors,
  fonts,
  getTheme,
  lazyLoadImage,
  roundTo,
  setTheme,
  spacing,
  validateForm
};
//# sourceMappingURL=index.js.map