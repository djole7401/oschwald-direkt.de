<?php

namespace Cart2cart;

class Installer
{
  public static function activate()
  {
    Api::getInstance(Plugin::APP_LINK)->request(
      Api::ANALYTICS_URL,
      array(
        'category' => 'WooPlugins',
        'event' => 'Install-Deinstall',
        'label' => 'Installed',
      )
    );
  }

  public static function uninstall()
  {
    Api::getInstance(Plugin::APP_LINK)->request(
      Api::ANALYTICS_URL,
      array(
        'category' => 'WooPlugins',
        'event' => 'Install-Deinstall',
        'label' => 'Deinstalled',
      )
    );
  }

  public static function deactivate()
  {
  }
}