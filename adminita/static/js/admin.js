document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("#dark-mode-toggle");
  const html = document.documentElement;

  // Apply saved mode ON LOAD
  if (localStorage.darkMode === "true") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }

  // Toggle when any button is clicked
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const isDark = html.classList.toggle("dark");
      localStorage.darkMode = isDark ? "true" : "false";
    });
  });


  // Mobile sidebar toggle
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');

  if (mobileMenuButton && sidebar && sidebarOverlay) {
    function toggleSidebar() {
      sidebar.classList.toggle('-translate-x-full');
      sidebarOverlay.classList.toggle('hidden');
    }

    mobileMenuButton.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', toggleSidebar);
  }

  // Form widget styling
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="number"], input[type="url"], input[type="tel"], textarea, select');

  inputs.forEach(input => {
    if (!input.classList.contains('vDateField') &&
      !input.classList.contains('vTimeField') &&
      !input.classList.contains('vForeignKeyRawIdAdminField')) {

      // Add Tailwind classes if not already present
      if (!input.className.includes('px-')) {
        input.classList.add(
          'w-full', 'px-3', 'py-2',
          'border', 'border-gray-300', 'dark:border-gray-600',
          'rounded-lg',
          'bg-white', 'dark:bg-gray-700',
          'text-gray-900', 'dark:text-gray-100',
          'placeholder-gray-500', 'dark:placeholder-gray-400',
          'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent',
          'transition-colors'
        );
      }
    }
  });

  // Checkbox and radio button styling
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const radios = document.querySelectorAll('input[type="radio"]');

  checkboxes.forEach(checkbox => {
    checkbox.classList.add(
      'rounded',
      'border-gray-300', 'dark:border-gray-600',
      'text-blue-600',
      'focus:ring-blue-500',
      'focus:ring-offset-0'
    );
  });

  radios.forEach(radio => {
    radio.classList.add(
      'border-gray-300', 'dark:border-gray-600',
      'text-blue-600',
      'focus:ring-blue-500',
      'focus:ring-offset-0'
    );
  });
});