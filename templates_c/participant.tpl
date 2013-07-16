{if $participants neq 'false'}
<table style="margin-left:auto; margin-right: auto;" border="1">
{foreach $participants as $p}
	<tr class="rand" id="part{$p.id}" onclick='SelectRow("part",{$p.id})'>
		<td style="width: auto;">{$p.name}</td>
		<td style="width: auto;">{$p.distribution}</td>
		{if $p.helpers_html}<td style="width: auto;" assigned="1">{$p.helpers_html}</td>
		{else}<td style="width: auto;"><p style=\"color: red\">No helpers assigned.</p></td>{/if}
		<td>{$p.date_reg}</td>
	</tr>
{/foreach}
</table>
{else}No participants here.{/if}
