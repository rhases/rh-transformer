'use strict';

var model = {
	Persons:{
		local:'Deal',
		remote: 'Persons',
		fields: [
			{local: 'pipedrive.person_id', remote:'id', policy: 'remote', isId:true},
			//to pipedrive
			{local: 'name', remote:'name', policy: 'local'},
			{local: 'phone', remote:'phone', policy: 'local', createOnly:true},
			{local: 'email', remote:'email', policy: 'local', createOnly:true},
			{local: 'pipedrive.deal_owner_id', remote:'owner_id', policy: 'local', createOnly:true},
			{local: 'pipedrive.followers', remote: 'followers', policy: 'local', createOnly:true }
		]
	},
	Organizations:{
		local:'Deal',
		remote: 'Organizations',
		fields: [
			{local: 'pipedrive.org_id', remote:'id', policy: 'remote', isId:true},
			{local: 'companyName', remote:'name', policy: 'local', required:true},
			{local: 'pipedrive.deal_owner_id', remote:'owner_id', policy: 'local', createOnly:true},
			{local: 'pipedrive.followers', remote: 'followers', policy: 'local', createOnly:true }
		]
	},
	Deals:{
		local:'Deal',
		remote: 'Deals',
		fields: [

			//to pipedrive
			{local: 'title', remote:'title', policy: 'local'},
			{local: 'potentialValue', remote:'value', policy: 'local'},
			{local: 'pipedrive.org_id', remote:'org_id', policy: 'local'},
			{local: 'pipedrive.person_id', remote:'person_id', policy: 'local'},
			{local: 'pipedrive.stage_id', remote:'stage_id', policy: 'local', createOnly:true},
			{local: 'pipedrive.deal_owner_id', remote:'user_id', policy: 'local', createOnly:true},
			{local: 'pipedrive.followers', remote: 'followers', policy: 'local', createOnly:true },
			
			//from pipedrive to rhases
			{ local: 'title', remote:'title', policy: 'remote'},
			{ local: 'potentialValue', remote:'value', policy: 'remote'},
			{ local: 'pipedrive.id', remote:'id', policy: 'remote', isId:true},
			{ local: 'pipedrive.add_time', remote: 'add_time', policy: 'remote', createOnly: true },
			{ local: 'pipedrive.status', remote: 'status', policy: 'remote', createOnly: true },
			{ local: 'pipedrive.stage_id', remote: 'stage_id', policy: 'remote' },
			{ local: 'pipedrive.add_time', remote: 'add_time', policy: 'remote' },
			{ local: 'pipedrive.update_time', remote: 'update_time', policy: 'remote' },
			{ local: 'pipedrive.stage_change_time', remote: 'stage_change_time', policy: 'remote' },
			{ local: 'pipedrive.active', remote: 'active', policy: 'remote' },
			{ local: 'pipedrive.deleted', remote: 'deleted', policy: 'remote' },
			{ local: 'pipedrive.status', remote: 'status', policy: 'remote' },
			{ local: 'pipedrive.probability', remote: 'probability', policy: 'remote' },
			{ local: 'pipedrive.next_activity_date', remote: 'next_activity_date', policy: 'remote' },
			{ local: 'pipedrive.next_activity_time', remote: 'next_activity_time', policy: 'remote' },
			{ local: 'pipedrive.next_activity_id', remote: 'next_activity_id', policy: 'remote' },
			{ local: 'pipedrive.last_activity_id', remote: 'last_activity_id', policy: 'remote' },
			{ local: 'pipedrive.last_activity_date', remote: 'last_activity_date', policy: 'remote' },
			{ local: 'pipedrive.lost_reason', remote: 'lost_reason', policy: 'remote' },
			{ local: 'pipedrive.close_time', remote: 'close_time', policy: 'remote' },
			{ local: 'pipedrive.pipeline_id', remote: 'pipeline_id', policy: 'remote' },
			{ local: 'pipedrive.won_time', remote: 'won_time', policy: 'remote' },
			{ local: 'pipedrive.first_won_time', remote: 'first_won_time', policy: 'remote' },
			{ local: 'pipedrive.lost_time', remote: 'lost_time', policy: 'remote' },
			{ local: 'pipedrive.notes_count', remote: 'notes_count', policy: 'remote' },
			{ local: 'pipedrive.activities_count', remote: 'activities_count', policy: 'remote' },
			{ local: 'pipedrive.done_activities_count', remote: 'done_activities_count', policy: 'remote' },
			{ local: 'pipedrive.undone_activities_count', remote: 'undone_activities_count', policy: 'remote' },
			{ local: 'pipedrive.reference_activities_count', remote: 'reference_activities_count', policy: 'remote' },
			{ local: 'pipedrive.stage_order_nr', remote: 'stage_order_nr', policy: 'remote' },
			{ local: 'pipedrive.next_activity_subject', remote: 'next_activity_subject', policy: 'remote' },
			{ local: 'pipedrive.next_activity_type', remote: 'next_activity_type', policy: 'remote' },
			{ local: 'pipedrive.rotten_time', remote: 'rotten_time', policy: 'remote' },
			{ local: 'pipedrive.owner_name', remote: 'owner_name', policy: 'remote' },
			{ local: 'pipedrive.cc_email', remote: 'cc_email', policy: 'remote' },
			
			//local id
			{local: '_id', policy: 'local', isId:true},
			
		]
	},
	MainNote:{
			local:'Deal',
			remote: 'Notes',
			fields: [
				{local: 'pipedrive.main_note_id', remote:'id', policy: 'remote', isId:true},
				{local: 'pipedrive.id', remote:'deal_id', policy: 'local'},
				{local: 'mainNote', remote:'content', policy: 'local'}
			]
	},
	CommentsNote:{
			local:'Deal',
			remote: 'Notes',
			fields: [
				{local: 'pipedrive.comments_note_id', remote:'id', policy: 'remote', isId:true},
				{local: 'pipedrive.id', remote:'deal_id', policy: 'local'},
				{local: 'pipedrive.comments_note_content', remote:'content', policy: 'local'}
			]
	},
	QualificationActivity:{
			local:'Deal',
			remote: 'Activities',
			fields: [
				{local: 'pipedrive.qualification_activity_id', remote:'id', policy: 'remote', isId:true},
				{local: 'preferContactBy', remote:'type', policy: 'local',
					dictionary: {
						phone:'call',
						whatsapp:'enviar_whatsapp_para_quali',
						email:'email'
					}
				},
				{local: 'preferContactBy', remote:'subject', policy: 'local',
					dictionary: {
						phone:({local}) => `Ligar para ${local.name}`,
						whatsapp:({local}) => `Enviar whatsapp para ${local.name}`,
						email:({local}) => `Mandar email para ${local.name}`
					}
				},
				{local:'preferContactBy', remote:'note', policy: 'local',
					dictionary: {
						phone:({local}) => `<a target="_blank" href="http://qualification-bot.prod.api.rhases.com.br/call/${local.phone}">${local.phone}</a>`,
						whatsapp:({local}) => `<a target="_blank" href="https://api.whatsapp.com/send?phone=55${local.phone}&text=Olá, ${local.name}!">${local.phone}</a>`,
						email:({local}) => `<a target="_blank" href="mailto:${local.email}">${local.email}</a>`,
					}
				},
				{local: 'pipedrive.id', remote:'deal_id', policy: 'local'},
				{local: 'pipedrive.deal_owner_id', remote:'user_id', policy: 'local'},
				{local: 'pipedrive.person_id', remote:'person_id', policy: 'local'},
				{local: 'pipedrive.org_id', remote:'org_id', policy: 'local'},
				{local: 'pipedrive.qualification_activity_due_date', remote: 'due_date', policy: 'local', createOnly: true},
				{local: 'pipedrive.qualification_activity_due_time', remote: 'due_time', policy: 'local', createOnly: true}
			]
	},
};

export default model;
