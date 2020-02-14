<?php

/**
 * Fired during plugin activation
 *
 * @link       http://www.wpbackitup.com
 * @since      1.14.0
 *
 * @package    WPBackitup_Premium
 * @subpackage WPBackitup_Premium/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.14.0
 * @package    WPBackitup_Premium
 * @subpackage WPBackitup_Premium/includes
 * @author     Chris Simmons <chris@wpbackitup.com>
 */
class WPBackitup_Premium_Activator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.14.0
	 */
	public static function activate() {

		//make sure the procuct ID is set if missing
		$product_id = get_option( 'wp-backitup_license_product_id',false );
		$license_type = get_option( 'wp-backitup_license_type',-1);
		//If no product ID and license type is premium
		if ( (false===$product_id || empty($product_id)) && $license_type>0)	{
			update_option('wp-backitup_license_product_id','679');
		}

		do_action( 'wpbackitup_check_license',true);
	}
}
