<?php

namespace Cart2cart;

class Plugin
{
  const PLUGINS_TITLE = 'Cart2cart: Magento to Woocommerce Plugin';

  const APP_LINK = 'https://woocommerce.app.shopping-cart-migration.com/';
  const PUBLIC_SITE_LINK = 'https://www.shopping-cart-migration.com/';

  const URL_LIMIT = 'from-magento-to-woocommerce';
  const SOURCE_CART_ID = 'Magento';

  const PLUGIN_PAGE = 'cart2cart-migration';
  const PRICING_PAGE = 'cart2cart-migration-pricing';
  const HOW_IT_WORKS_PAGE = 'cart2cart-how-it-works';
  const SERVICES_PAGE = 'cart2cart-additional-services';
  const HELP_PAGE = 'cart2cart-migration-help';

  /** @var \Cart2cart\View  */
  public $view;

  public function __construct()
  {
    $this->view = new View();
    $this->_addActions();
  }

  public static function init()
  {
    new self;
  }

  private function _addActions()
  {
    add_action('admin_menu', array($this, 'registerMenuItems'));
    add_action('wp_ajax_nopriv_actionsProcessor', array($this, 'actionsProcessor'));
  }

  public function registerMenuItems()
  {
    add_menu_page(
      'Cart2Cart Migration',
      'Cart2Cart Migration',
      'manage_options',
      self::PLUGIN_PAGE,
      array($this, 'getPluginsPageContent'),
      plugins_url('/img/icon.png', CART2CART_PLUGIN_ROOT_DIR . 'dir'),
      60
    );

    add_submenu_page(self::PLUGIN_PAGE, 'Pricing', 'Pricing', 'manage_options', self::PRICING_PAGE, array($this, 'pricingPageContent'));
    add_submenu_page(self::PLUGIN_PAGE, 'How it works', 'How it works', 'manage_options', self::HOW_IT_WORKS_PAGE, array($this, 'howItWorksPageContent'));
    add_submenu_page(self::PLUGIN_PAGE, 'Additional Services', 'Additional Services', 'manage_options', self::SERVICES_PAGE, array($this, 'servicesPageContent'));
    add_submenu_page(self::PLUGIN_PAGE, 'Live Chat & Help', 'Live Chat & Help', 'manage_options', self::HELP_PAGE, array($this, 'faqHelpPageContent'));
  }

  public function getPluginsPageContent()
  {
    $this->view->assign('framePath', self::APP_LINK . self::URL_LIMIT . '/?' . http_build_query(array(
      'storeUrl' => get_site_url(),
      'storeAdminUrl' => admin_url('admin-ajax.php'),
    )));

    echo $this->view->render('main/index.phtml');
  }

  public function pricingPageContent()
  {
    $this->view->assign('framePath', self::APP_LINK . self::URL_LIMIT . '/estimation?' . http_build_query(array(
        'storeUrl' => get_site_url(),
        'storeAdminUrl' => admin_url('admin-ajax.php'),
    )));

    echo $this->view->render('pricing/index.phtml');
  }

  public function supportChatPageContent()
  {
    $this->view->assign('framePath', 'https://support.magneticone.com/visitor/index.php?/LiveChat/Chat/Request/_proactive=1/_filterDepartmentID=6%2C66/_randomNumber=23/_promptType=chat');

    echo $this->view->render('support/chat.phtml');
  }

  public function howItWorksPageContent()
  {
    $this->view->assign('framePath', self::APP_LINK . sprintf('module/woocommerce/how-it-works/sourceId/%s/targetId/Woocommerce', self::SOURCE_CART_ID));
    echo $this->view->render('support/how-it-works.phtml');
  }

  public function servicesPageContent()
  {
    $this->view->assign('framePath', self::APP_LINK . 'module/woocommerce/additional-services');
    echo $this->view->render('support/how-it-works.phtml');
  }

  public function faqHelpPageContent()
  {
    $this->view->assign('framePath', self::APP_LINK . 'module/woocommerce/help-and-faqs');
    echo $this->view->render('support/faqs-and-help.phtml');
  }

  public static function actionsProcessor()
  {
    header('Access-Control-Allow-Origin: *');

    $bridge = new Bridge;
    $flags = FILTER_SANITIZE_STRING;

    $response = $bridge->perform(filter_input(INPUT_POST, 'mode', $flags), filter_input(INPUT_POST, 'token', $flags));

    wp_die(json_encode($response, JSON_UNESCAPED_UNICODE));
  }
}