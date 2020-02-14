<?php if (!defined ('ABSPATH')) die('No direct access allowed');


/**
 * WP BackItUp  - Premium Settings
 *
 * @package WPBackItUp Premium
 * @author  Chris Simmons <chris@wpbackitup.com>
 * @link    http://www.wpbackitup.com
 *
 */


?>

<div class="widget">
	<h3 class="promo"><i class="fa fa-scissors"></i> <?php _e('Disable restore version compare?', 'wp-backitup') ?></h3>
	<p>
        <input type="checkbox" v-model="rversion_compare" checked="rversion_compare === true">
		<label for="wpbackitup_rversion_compare"><?php _e('Check this box if you would like WPBackItUp not to check major version issue. This could be dangerous, you can disable it with your own risk.', 'wp-backitup') ?></label>
    </p>

    <div class="submit">
        <button class="button-primary" v-on:click="setSettings()"><?php _e("Save", 'wp-backitup') ?></button>
    </div>
</div>

<div class="widget">
	<h3 class="promo"><i class="fa fa-file-archive-o"></i> <?php _e('Single File Backup Set', 'wp-backitup') ?></h3>
	<p>
        <input type="checkbox" v-model="single_file_backupset" checked="single_file_backupset === true">
		<label for="wpbackitup_single_file_backupset"><?php _e('Check this box if you would like WPBackItUp to create a single zip file that contains your entire backup.', 'wp-backitup') ?></label></p>
	<p><?php _e('When this setting is turned on WPBackItUp will attempt to create a single zip file that contains your entire backup.  This option may may not be possible with some hosting providers.  This setting will be turned off automatically if WPBackItUp is unable to complete this step for any reason.', 'wp-backitup') ?></p>

	<p>
        <input type="checkbox" v-model="remove_supporting_zip_files" checked="remove_supporting_zip_files === true">
		<label for="wpbackitup_remove_supporting_zip_files"><?php _e('Check this box if you would like WPBackItUp to cleanup supporting zip files.', 'wp-backitup') ?></label></p>
	<p><?php _e('When this setting is turned on WPBackItUp will remove the supporting zip files(plugins, themes, uploads) that were used to create your backup set.  These supporting files will be contained in the backup set and are no longer needed to restore your site. Selecting this option will allow you to reduce the amount of space utilized on your host used for backups.   Please note that if this option is selected, supporting zip files will no longer be available for download separate from the backup set.', 'wp-backitup') ?></p>

    <div class="submit">
        <button class="button-primary" v-on:click="setSettings()"><?php _e("Save", 'wp-backitup') ?></button>
    </div>
</div>



