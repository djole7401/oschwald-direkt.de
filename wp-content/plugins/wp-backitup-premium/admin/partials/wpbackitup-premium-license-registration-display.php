<?php if (!defined ('ABSPATH')) die('No direct access allowed');

/**
 * WP BackItUp  - Registration Form Widget
 *
 * @package WPBackItUp Premium
 * @author  Chris Simmons <chris@wpbackitup.com>
 * @link    http://www.wpbackitup.com
 *
 */


$WPBackItUp_License = new WPBackItUp_License();
//error_log(var_export($WPBackItUp_License->is_license_active(),true));

//IF license is active disaply status
if (true===$WPBackItUp_License->is_license_valid() && true===$WPBackItUp_License->is_premium_license()) {
	?>
	<!-- Display license key widget -->
	<div class="widget">
		<h3 class="promo"><span><?php _e('Premium License Info', 'wp-backitup'); ?></span><span style="float: right"></h3></h3>
		<form action="" method="post" id="<?php echo WPBACKITUP__NAMESPACE; ?>-form">
			<input type="hidden" name="product_id" value="<?php echo WPBACKITUP_PREMIUM__ITEM_ID; ?>" />
			<?php wp_nonce_field(WPBACKITUP__NAMESPACE . "-update-options"); ?>
			<?php

			$fontColor='green';
			if ($WPBackItUp_License->get_license_status()=='valid')
				$fontColor='green';

			if ($WPBackItUp_License->get_license_status()=='invalid')
				$fontColor='red';

			if ($WPBackItUp_License->get_license_status()=='expired')
				$fontColor='orange';

			if($WPBackItUp_License->is_license_active()) {
				echo('<p>');
				echo(__('Name', 'wp-backitup') . ': &nbsp;' . $WPBackItUp_License->get_customer_name());
				echo('<br/>' . __('Email', 'wp-backitup') . ': &nbsp;' . $WPBackItUp_License->get_customer_email());
				echo('<br/>' . __('License Type', 'wp-backitup') . ': &nbsp;' . $WPBackItUp_License->get_license_type_description());
				echo('<br/>' . __('Expires', 'wp-backitup') . ': &nbsp;' . date('F j, Y',strtotime($WPBackItUp_License->get_license_expires_date())));
				echo('</p>');
			} else {
				echo '<p>' . __('Enter license key to activate on this site.','wp-backitup') . '</p>';
			}
			?>

			<input type="text" name="license_key" id="license_key" value="<?php echo $WPBackItUp_License->get_license_key(); ?>" />&nbsp;

			<?php if ($WPBackItUp_License->get_license_status()=='valid'): ?>
				<div>
					<span style="color:green"><?php printf(__('License Active', 'wp-backitup')) ?></span>
				</div>
			<?php endif; ?>

			<?php if ($WPBackItUp_License->get_license_status()=='invalid'): ?>
				<div>
					<span style="color:<?php echo $fontColor; ?>"><?php printf(__("%s", 'wp-backitup'), $WPBackItUp_License->get_license_status_message()); ?></span>
				</div>
			<?php endif; ?>

			<?php if ($WPBackItUp_License->get_license_status()=='expired'): ?>
				<div>
					<span style="color:red"><?php _e('License expired', 'wp-backitup') ?>:&nbsp;<?php printf(__("%s", 'wp-backitup'),  date('F j, Y',strtotime($WPBackItUp_License->get_license_expires_date()))); ?></span>
				</div>
			<?php endif; ?>

			<?php if ($WPBackItUp_License->is_license_active()) : ?>
				<div class="submit"><input type="submit" name="Submit" class="button-secondary" value="<?php _e("Update", 'wp-backitup') ?>" /></div>
			<?php endif; ?>

			<?php if (!$WPBackItUp_License->is_license_active()) : ?>
				<div class="submit"><input type="submit" name="Submit" class="button-secondary" value="<?php _e("Activate", 'wp-backitup') ?>" /></div>
			<?php endif; ?>

			<?php if ($WPBackItUp_License->get_license_status()=='invalid' || $WPBackItUp_License->get_license_status()==''): ?>
				<div><?php printf(__("Purchase a %s license using the purchase link above.", 'wp-backitup'), WPBackItUp_Utility::get_anchor_with_utm(__('no-risk','wp-backitup'),'pricing-purchase','license','no+risk')) ?></div>
			<?php endif; ?>

			<?php if ($WPBackItUp_License->get_license_status()=='expired'): ?>
				<div>
					<?php
					printf( __('Please <a href="%s" target="blank">renew</a> now for another year of <strong>product updates</strong> and access to our <strong>world class support</strong> team.','wp-backitup'),
						esc_url(sprintf('%s/checkout?edd_license_key=%s&download_id=679&nocache=true&utm_medium=plugin&utm_source=wp-backitup&utm_campaign=premium&utm_content=license&utm_term=license+expired', WPBACKITUP__SECURESITE_URL,$WPBackItUp_License->get_license_key())))?>
				</div>
			<?php endif; ?>

		</form>
	</div>

<?php } else { ?>
	<div class="widget">
		<h3 class="promo"><span><?php _e('Activate WPBackItUp Premium', 'wp-backitup'); ?></span></h3>
		<form action="" method="post" id="<?php echo WPBACKITUP__NAMESPACE; ?>-form">
			<input type="hidden" name="product_id" value="<?php echo urlencode(WPBACKITUP_PREMIUM__ITEM_ID); ?>" />
			<?php wp_nonce_field(WPBACKITUP__NAMESPACE . "-register"); ?>
			<p><?php _e('Enter your license key below to activate WPBackitUP Premium .  <br />', 'wp-backitup'); ?></p>
<!--			<input type="text" name="license_name" id="license_name" placeholder="--><?php //_e('name','wp-backitup')?><!--" value="--><?php //echo($WPBackItUp_License->get_customer_name()) ?><!--" /><br/>-->
<!--			<input type="text" name="license_email" id="license_email" placeholder="--><?php //_e('email address','wp-backitup')?><!--" value="--><?php //echo($WPBackItUp_License->get_customer_email()) ?><!--" /><br/>-->
			<input type="text" name="license_key" id="license_key" placeholder="<?php _e('license key','wp-backitup')?>" value="<?php if ($WPBackItUp_License->is_premium_license()) { echo $WPBackItUp_License->get_license_key(); } ?>" />
			<br />&nbsp;<span style="color:red"><?php printf(__("%s", 'wp-backitup'), $WPBackItUp_License->get_license_status_message()); ?></span>
			<div class="submit"><input type="submit" name="Submit" class="button-secondary" value="<?php _e("Register", 'wp-backitup') ?>" /></div>
		</form>
	</div>
<?php }