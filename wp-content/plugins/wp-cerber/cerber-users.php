<?php

add_action( 'personal_options', function ( $profileuser ) {
	if ( defined( 'IS_PROFILE_PAGE' ) && IS_PROFILE_PAGE ) {
		return;
	}
	$b     = crb_is_user_blocked( $profileuser->ID );
	$b_msg = ( ! empty( $b['blocked_msg'] ) ) ? $b['blocked_msg'] : '';
	$dsp   = ( ! $b ) ? 'display:none;' : '';
	?>
    <tr>
        <th scope="row"><?php _e( 'Block User', 'wp-cerber' ); ?></th>
        <td>
            <fieldset>
                <legend class="screen-reader-text">
                    <span><?php _e( 'User is not permitted to log into the website', 'wp-cerber' ) ?></span>
                </legend>
                <label for="crb_user_blocked">
                    <input name="crb_user_blocked" type="checkbox" id="crb_user_blocked"
                           value="1" <?php
				    checked( ( $b ) ? true : false ); ?> />
				    <?php _e( 'User is not permitted to log into the website', 'wp-cerber' );
				    if ( ! empty( $b['blocked_by'] ) ) {
					    if ( $b['blocked_by'] == get_current_user_id() ) {
						    $who = __( 'You', 'wp-cerber' );
					    }
					    else {
						    $user = get_userdata( $b['blocked_by'] );
						    $who  = $user->display_name;
						}
						$who = sprintf( _x( 'blocked by %s at %s', 'e.g. by John at 11:00', 'wp-cerber' ), $who, cerber_date( $b['blocked_time'] ) );
						echo ' - <i>' . $who . '</i>';
					}
					?>
                </label>
            </fieldset>

        </td>
    </tr>
    <tr id="crb_blocked_msg_row" style="<?php echo $dsp; ?>">
        <th scope="row"><?php _e( 'User Message', 'wp-cerber' ); ?></th>
        <td>
            <textarea placeholder="<?php _e( 'An optional message for this user', 'wp-cerber' ); ?>"
                      id="crb_blocked_msg" name="crb_blocked_msg"><?php echo htmlspecialchars( $b_msg ); ?></textarea>
        </td>
    </tr>
	<?php

}, 1000 );

add_action( 'edit_user_profile_update', function ( $user_id ) {
	if ( $user_id == get_current_user_id() ) {
		return;
	}
	$b = absint( $_POST['crb_user_blocked'] );
	if ( ! $b ) {
		delete_user_meta( $user_id, CERBER_BUKEY );

		return;
	}
	$m = get_user_meta( $user_id, CERBER_BUKEY, 1 );
	if ( ! $m ) {
		$m            = array();
		$m['blocked'] = 0;
	}
	if ( $m['blocked'] != $b ) {
		$m['blocked']        = $b;
		$m[ 'u' . $user_id ] = $user_id;
		$m['blocked_by']     = get_current_user_id();
		$m['blocked_time']   = time();
		$m['blocked_ip']     = cerber_get_remote_ip();
	}
	$m['blocked_msg'] = strip_tags( stripslashes( $_POST['crb_blocked_msg'] ) );
	update_user_meta( $user_id, CERBER_BUKEY, $m );
} );

add_filter( 'user_row_actions', 'crb_collect_uids', 10, 2 );
add_filter( 'ms_user_row_actions', 'crb_collect_uids', 10, 2 );
function crb_collect_uids( $actions, $user_object ) {
	crb_user_id_list( $user_object->ID );

	return $actions;
}

function crb_user_id_list( $uid = 0 ) {
	static $list = array();
	if ( $uid ) {
		$list[ $uid ] = $uid;
	}
	else {
		return $list;
	}
}

add_filter( 'views_users', function ( $views ) {
	global $wpdb;
	$c = cerber_db_get_var( 'SELECT COUNT(meta_key) FROM ' . $wpdb->usermeta . ' WHERE meta_key = "' . CERBER_BUKEY . '"' );
	$t = __( 'Blocked Users', 'wp-cerber' );
	if ( $c ) {
		$t = '<a href="users.php?crb_filter_users=blocked">' . $t . '</a>';
	}
	$views['cerber_blocked'] = $t . ' (' . $c . ')';

	return $views;
} );

add_filter( 'users_list_table_query_args', function ( $args ) {
	if ( isset( $_REQUEST['crb_filter_users'] ) ) {
		$args['meta_key']     = CERBER_BUKEY;
		$args['meta_compare'] = 'EXISTS';
	}

	return $args;
} );

function crb_format_user_name( $data ) {
	if ( $data->first_name ) {
		$ret = $data->first_name . ' ' . $data->last_name;
	}
	else {
		$ret = $data->display_name;
	}

	return $ret . ' (' . $data->user_login . ')';
}