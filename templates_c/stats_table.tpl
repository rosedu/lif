<table style="margin-left: auto; margin-right: auto;" border="0">
	<caption style="text-align: center;font-size: 2em; text-shadow: #999 4px 4px 2px; margin-bottom: 10px;">Rezultate Linux Install Fest v5</caption>
	<thead>
		<td style="background-color: #69F; font-weight: bold; text-align: center; font-family: Georgia">Nume Participant</td>
		<td style="background-color: #69F; font-weight: bold; text-align: center; font-family: Georgia">Distribuție </td>
		<td style="background-color: #69F; font-weight: bold; text-align: center; font-family: Georgia">Ajutat de: </td>
		<td style="background-color: #69F; font-weight: bold; text-align: center; font-family: Georgia">Data Înregistrării </td>
		<td style="background-color: #69F; font-weight: bold; text-align: center; font-family: Georgia;">Data Terminării </td>
		<td style="background-color: #69F; font-weight: bold; text-align: center; font-family: Georgia; width: 300px">Comments </td>
	</thead>
{if $participants neq 'false'}
	<tbody>
{foreach $participants as $p}
	{if $p@iteration is odd by 1}
		<tr style="background-color: #EFB;" class="rand" id="part{$p.id}" >
	{else}
		<tr style="background-color: #8E5;" class="rand" id="part{$p.id}" >
	{/if}
			<td style="width: auto; font-family: Georgia; font-size: small;">{$p.name}</td>
			<td style="width: auto; font-family: Georgia; font-size: small;">{$p.distribution}</td>
			<td style="width: auto; font-family: Georgia; font-size: small;">{if $p.helpers_html}{$p.helpers_html}{else}<p style=\"color: red\">No helpers assigned.</p>{/if}</td>
			<td style="font-family: Georgia; font-size: small;">{$p.date_reg}</td>
			<td style="font-family: Georgia; font-size: small;">{$p.date_finished}</td>
			<td style="width: 300px; font-family: Georgia; font-size: small;">{$p.comments}<br /></td>
		</tr>
{/foreach}
	</tbody>
{/if}
</table>
