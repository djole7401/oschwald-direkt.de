<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       http://www.wpbackitup.com
 * @since      1.14.0
 *
 * @package    WPBackitup_Premium
 * @subpackage WPBackitup_Premium/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.14.0
 * @package    WPBackitup_Premium
 * @subpackage WPBackitup_Premium/includes
 * @author     Chris Simmons <chris@wpbackitup.com>
 */
class WPBackitup_Premium_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.14.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'wpbackitup-premium',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
