<?php

/**
 * Fired during plugin deactivation
 *
 * @link       http://www.wpbackitup.com
 * @since      1.14.0
 *
 * @package    WPBackitup_Premium
 * @subpackage WPBackitup_Premium/includes
 */

/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @since      1.14.0
 * @package    WPBackitup_Premium
 * @subpackage WPBackitup_Premium/includes
 * @author     Chris Simmons <chris@wpbackitup.com>
 */
class WPBackitup_Premium_Deactivator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.14.0
	 */
	public static function deactivate() {
		wp_clear_scheduled_hook('wpbackitup-premium_daily_scheduled_events');
		wp_clear_scheduled_hook('wpbackitup-premium_weekly_scheduled_events');
	}

}
