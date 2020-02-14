<?php
/**
 * Checkout Mutlistep Next Step Button
 *
 * @author 		Vendidero
 * @package 	WooCommerceGermanizedPro/Templates
 * @version     1.0
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

?>

<?php
/**
 * Terms and conditions hook used to inject content.
 */
do_action( 'woocommerce_gzdp_checkout_before_privacy_policy' );
?>

<p class="form-row legal data-privacy validate-required">
	<label for="gzdp-privacy-policy" class="woocommerce-form__label woocommerce-form__label-for-checkbox checkbox">
		<?php if ( get_option( 'woocommerce_gzdp_checkout_privacy_policy_checkbox' ) === 'yes' ) : ?>
			<input type="checkbox" class="woocommerce-form__input woocommerce-form__input-checkbox input-checkbox" name="gzdp_privacy_policy" id="gzdp-privacy-policy" />
		<?php endif; ?>
		<span class="woocommerce-gzdp-multistep-privacy-policy-checkbox-text"><?php echo wc_gzdp_get_privacy_policy_text(); ?></span>
	</label>
</p>
