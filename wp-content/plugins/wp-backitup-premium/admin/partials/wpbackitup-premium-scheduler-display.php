<?php if (!defined ('ABSPATH')) die('No direct access allowed');


/**
 * WP BackItUp  - Scheduler Widget
 *
 * @package WPBackItUp Premium
 * @author  Chris Simmons <chris@wpbackitup.com>
 * @link    http://www.wpbackitup.com
 *
 */

		$WPBackItUp_License = new WPBackItUp_License();

		$schedules       = new WPBackItUp_Job_Scheduler();
		$backup_schedule = $schedules->get_backup_schedule();

		//Do they have a valid license
		if ( ! $WPBackItUp_License->is_license_valid() ) {
			return;
		}

		//if license is expired just disable the scheduler selection
		$schedule_style_disabled = '';
		if ( $WPBackItUp_License->is_license_valid() && 'expired' == $WPBackItUp_License->get_license_status() ) {
			$schedule_style_disabled = 'disabled';
		}

//TODO:Add disabled property to vue component for when license is expired
		?>

		<schedule-modal></schedule-modal>
