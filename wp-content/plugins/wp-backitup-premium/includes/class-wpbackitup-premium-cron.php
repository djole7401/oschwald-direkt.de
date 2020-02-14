<?php

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * WPBackItUp Premium Cron Class
 *
 * This class handles scheduled events
 *
 * @since 1.15.4
 */
class WPBackItUp_Premium_Cron {


	public function __construct() {
		add_filter( 'cron_schedules', array( $this, 'add_schedules'   ) );
		add_action( 'init', array( $this, 'schedule_events' ) );
	}

	/**
	 * Registers new cron schedules
	 *
	 * @param array $schedules
	 * @return array
	 */
	public function add_schedules( $schedules = array() ) {
		// Adds once weekly to the existing schedules.
		$schedules['weekly'] = array(
			'interval' => 604800,
			'display'  => __( 'Once Weekly', 'wpbackitup-premium' )
		);

		// Adds once daily to the existing schedules.
		$schedules['daily'] = array(
			'interval' => 86400,
			'display'  => __( 'Once Weekly', 'wpbackitup-premium' )
		);

		return $schedules;
	}

	/**
	 * Schedules events
	 *
	 * @return void
	 */
	public function schedule_events() {
		$this->schedule_weekly_events();
		$this->schedule_daily_events();
	}

	/**
	 * Schedule weekly events
	 *
	 * @access private
	 * @return void
	 */
	private function schedule_weekly_events() {
		if ( ! wp_next_scheduled( 'wpbackitup-premium_weekly_scheduled_events' ) ) {
			wp_schedule_event( current_time( 'timestamp', true ), 'weekly', 'wpbackitup-premium_weekly_scheduled_events' );
		}
	}

	/**
	 * Schedule daily events
	 *
	 * @access private
	 * @return void
	 */
	private function schedule_daily_events() {
		if ( ! wp_next_scheduled( 'wpbackitup-premium_daily_scheduled_events' ) ) {
			wp_schedule_event( current_time( 'timestamp', true ), 'daily', 'wpbackitup-premium_daily_scheduled_events' );
		}
	}

	/**
	 * Unscheduled all WPBackItUp Safe events
	 *
	 */
	public static function unschedule_events() {
		wp_clear_scheduled_hook('wpbackitup-premium_daily_scheduled_events');
		wp_clear_scheduled_hook('wpbackitup-premium_weekly_scheduled_events');
	}


	/**
	 * Abstraction for WordPress cron checking, to avoid code duplication.
	 *
	 */
	static function doing_cron() {

		// Bail if not doing WordPress cron (>4.8.0)
		if ( function_exists( 'wp_doing_cron' ) && wp_doing_cron() ) {
			return true;

		// Bail if not doing WordPress cron (<4.8.0)
		} elseif ( defined( 'DOING_CRON' ) && ( true === DOING_CRON ) ) {
			return true;
		}

		// Default to false
		return false;
	}

}
$wpb_cron = new WPBackItUp_Premium_Cron();
