<?php
/**
 * Tracking functions for reporting plugin usage for users that have opted in
 *
 * @since      1.15.4
 * @package    Wpbackitup_Premium
 * @subpackage Wpbackitup_Premium/includes
 * @author     WP BackItUp <wpbackitup@wpbackitup.com>
 *
 */

// Exit if accessed directly
if ( !defined( 'ABSPATH' ) ) exit;


/**
 * Usage tracking
 *
 * @return void
 */
class WPBackItUp_Premium_Usage {

	/**
	 * Log Name
	 *
	 * @access private
	 */
	private $log_name;


	public function __construct() {
		$this->log_name = 'debug_usage';//default log name

		add_action( 'init', array( $this, 'schedule_events' ) );
		add_filter( 'wpbackitup_ut_data',array( $this, 'premium_ut_data' ));
	}

	/**
	 * Send the data to the usage service
	 *
	 * @access private
	 *
	 * @return bool
	 * @throws Exception
	 */
	public function ut_event($ignore_last_checkin = false ) {

		try {
			//fire the user tracking event
			do_action('wpbackitup_ut_event',true,$ignore_last_checkin,'wpbackitup_premium');

			//This should probably go in the cron class or somewhere else but fine here for now
			do_action( 'wpbackitup_check_license');

		} catch (Exception $e) {
			WPBackItUp_Logger::log_error($this->log_name,__METHOD__,'Exception: ' .$e);
			return false;
		}

	}

	/**
	 * Filter to add usage data for premium plugin
	 *
	 * @param $ut_data
	 *
	 * @return array|bool
	 */
	function premium_ut_data($ut_data) {
		try {
			$wpb_license = new WPBackItUp_License();
			$premium_metrics = array(
				"wpbackitup_premium_version"=>WPBACKITUP_PREMIUM__VERSION,
				"wpbackitup_license_key"=>$wpb_license->get_license_key(),
				"wpbackitup_license_type"=>$wpb_license->get_license_type(),
				"wpbackitup_license_expires"=>$wpb_license->get_license_expires_date(),
				"wpbackitup_license_status"=>$wpb_license->get_license_status(),
			);

			return  array_merge ($ut_data,$premium_metrics);

		} catch (Exception $e) {
			WPBackItUp_Logger::log_error($this->log_name,__METHOD__,'Exception: ' .$e);
			return false;
		}

	}

	/**
	 * Schedule a weekly checkin
	 *
	 * We send once a week (while tracking is allowed) to check in, which can be
	 * used to determine active sites.
	 *
	 * @return void
	 */
	public function schedule_events() {

		if ( WPBackItUp_Premium_Cron::doing_cron() ) {
			//Fire check daily but UT class will only allow once per week max
			add_action( 'wpbackitup-premium_daily_scheduled_events', array( $this, 'ut_event' ) );
		}
	}
}
$wpb_tracking = new WPBackItUp_Premium_Usage();