import notification from 'antd/lib/notification';
import 'antd/lib/notification/style/index.css';

// API: https://ant.design/components/notification/

// notification.success(config);
// notification.error(config);
// notification.info(config);
// notification.warning(config);
// notification.warn(config);
// notification.open(config);
// notification.close((key: String));
// notification.destroy();

// Config API
// Property	    Description	                                                                                                  Type	          Default
// bottom	      Distance from the bottom of the viewport, when placement is bottomRight or bottomLeft(unit: pixels).          number	        24
// duration	    Time in seconds before Notification is closed.When set to 0 or null, it will never be closed automatically	  number	        4.5
// getContainer	Return the mount node for Notification                                                                        () => HTMLNode  () => document.body
// placement	  Position of Notification, can be one of topLeft topRight bottomLeft bottomRight	                              string	        topRight
// top	        Distance from the top of the viewport, when placement is topRight or topLeft(unit: pixels).                   number	        24

export default notification;
