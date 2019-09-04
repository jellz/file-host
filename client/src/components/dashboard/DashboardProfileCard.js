import { h, Component } from 'preact';

export default class DashboardProfileCard extends Component {
	render() {
		return (
			<div>
				{this.props.user && (
					<div>
						<h4>My Profile</h4>
						<div class='card'>
							<div>
								<div>
									<label>Username</label>
									<input
										type='text'
										disabled
										value={this.props.user.username}
									/>
								</div>
								<div>
									<label>Email</label>
									<input type='text' disabled value={this.props.user.email} />
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
}
