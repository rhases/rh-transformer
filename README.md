<p align="center">
  <img src="">
</p>

<h1 align="center">Rh-transformer</h1>

<p align="center">
  Specify schema transformations with JSON. Transform in both directions. Transform and check for updates then patch locally.
</p>

<code>
var transformations = {
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
</code>

<h2>transformOut</h2>
<code>
  	var transport = transportOut(transformations.Persons.fields, localDeal, {});
  });
</code>

<h2>transformIn</h2>
<code>
  	var transport = transportIn(model.Persons.fields, pdDeal, {});
</code>

<a href="http://www.rhases.com.br"> Rhases - Encontre, compare contrate o melhor plano de saúde pra você </a>